#!/usr/local/bin/python
# coding:utf-8

import os
import re
import math

def check_keyword(content, keyword):
	if keyword in content:
		return content.count(keyword)
	else:
		return -1

def read_lib(path):
	lib = dict()
	f = open(path,'r')
	lines_f = f.readlines()
	# print lines_f
	f.close()
	# spicial split
	# for line in lines_f:
	for i in range(0, len(lines_f)):
		if "////" in line[i]:
			i += 1
			# next(line)
			key = line[i].split("D")[1].split("(")[0]
			tmp = ""
			i += 1
			while True:
				if "////" in line[i]:
					break
				tmp += line[i]
				i += 1
			lib[key] = tmp
	return lib
				# lib(line[i].split("D")[1].split("(")[0]) = 

# def hash_table(content):
# 	table = dict()


def str_replace(content):
	# if "vec" in content:
	if "vec" in content:
		conntent.replace("vec", "ivec")
	if "float" in content:
		content.replace("float", "int")

def fun_replace(content, table, lib):
	if "*" in content:
		fir = content.split("*")[0].split("(")[-1]
		end = content.split("*")[1].split(")")[0]
		gen = content.split("*")



if __name__ == '__main__':
	
