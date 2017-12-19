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
import re
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
    
@app.route("/receive", methods=['POST'])
def receive():
    values = request.get_json()
    return doInsert(values)

def doInsert(values):
    result = {}
    agent = ""
    IP = ""
    try:
        agent = request.headers.get('User-Agent')
        IP = request.remote_addr
    except:
        pass
    values['agent'] = agent
    values['IP'] = IP
    clientid = values['clientid']
    pichashes = values['pichashes']
    # create a new record in features table
    sql_str = "INSERT INTO maintable (clientid, IP, agent, pichashes) VALUES ('{}', '{}', '{}', '{}')".format(clientid, IP, agent, pichashes)
    run_sql(sql_str)
    # res = doUpdateFeatures(values['clientid'], values)
    return flask.jsonify({'finished': values['clientid']}) 

@app.route("/pictures", methods=['POST'])
def store_pictures():
    # get ID for this picture
    image_b64 = request.values['imageBase64']
    hash_value = hashlib.sha1(image_b64).hexdigest()
    #sql_str = "INSERT INTO pictures (dataurl) VALUES ('" + hash_value + "')"
    # remove the define part of image_b64
    image_b64 = re.sub('^data:image/.+;base64,', '', image_b64)
    # decode image_b64
    image_data = image_b64.decode('base64')
    image_data = cStringIO.StringIO(image_data)
    image_PIL = Image.open(image_data)
    image_PIL.save("/home/sol315/pictures/" + str(hash_value) + ".png")
    return hash_value 
