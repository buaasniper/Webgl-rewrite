from flask import Flask, request,make_response, current_app
import os
import md5
from flask_failsafe import failsafe
import flask
from flask_cors import CORS, cross_origin
import json
import hashlib
from flaskext.mysql import MySQL
import ConfigParser
from PIL import Image
import base64
import cStringIO
from datetime import datetime

root = "/home/sol315/server/sjcollect/"
pictures_path = "/home/sol315/pictures/"
config = ConfigParser.ConfigParser()
config.read(root + 'password.ignore')

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = config.get('mysql', 'username')
app.config['MYSQL_DATABASE_PASSWORD'] = config.get('mysql', 'password')
app.config['MYSQL_DATABASE_DB'] = 'sjcollect'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)
CORS(app)
base64_header = "data:image/png;base64,"

feature_list = [
        'IP',
        'clientid',
        'pichashes',
        'agent'
        ]

def run_sql(sql_str):
    db = mysql.get_db()
    cursor = db.cursor()
    cursor.execute(sql_str)
    db.commit()
    res = cursor.fetchall() 
    return res


# update one feature requested from client to the database asynchronously.
# before this function, we have to make sure
# every feature is included in the sql server
def doUpdateFeatures(clientid, data):
    update_str = ""
    for key, value in data.iteritems():
        update_str += '{}="{}",'.format(key, value)

    update_str = update_str[:-1]
    sql_str = 'UPDATE maintable SET {} WHERE clientid = "{}"'.format(update_str, clientid)
    res = run_sql(sql_str)
    return res 
    
def doInit(clientid):
    result = {}
    agent = ""
    IP = ""
    try:
        agent = request.headers.get('User-Agent')
        IP = request.remote_addr
    except:
        pass

    # create a new record in features table
    sql_str = "INSERT INTO maintable (clientid, IP) VALUES ('{}', '{}')".format(clientid, IP)
    run_sql(sql_str)
    # update the statics
    result['agent'] = agent
    return doUpdateFeatures(clientid, result)

@app.route("/pictures", methods=['POST'])
def store_pictures():
    # get ID for this picture
    image_b64 = request.values['imageBase64']
    hash_value = hashlib.sha1(image_b64).hexdigest()

    db = mysql.get_db()
    cursor = db.cursor()
    sql_str = "INSERT INTO pictures (dataurl) VALUES ('" + hash_value + "')"
    cursor.execute(sql_str)
    db.commit()

    # remove the define part of image_b64
    image_b64 = re.sub('^data:image/.+;base64,', '', image_b64)
    # decode image_b64
    image_data = image_b64.decode('base64')
    image_data = cStringIO.StringIO(image_data)
    image_PIL = Image.open(image_data)
    image_PIL.save("/home/sol315/pictures/" + str(hash_value) + ".png")
    return hash_value 

@app.route('/updateFeatures', methods=['POST'])
def updateFeatures():
    result = request.get_json()
    clientid = result['clientid']
    features = {}
    for feature in result.iterkeys():
        if feature not in feature_list:
            continue
        value = result[feature]
        features[feature] = value

    doUpdateFeatures(clientid, features)
    return flask.jsonify({'finished': features.keys()})
