# -*- coding: utf-8 -*-
#
# This file is part of EUDAT B2Share.
# Copyright (C) 2016 University of Tuebingen, CERN.
#
# B2Share is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License as
# published by the Free Software Foundation; either version 2 of the
# License, or (at your option) any later version.
#
# B2Share is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with B2Share; if not, write to the Free Software Foundation, Inc.,
# 59 Temple Place, Suite 330, Boston, MA 02111-1307, USA.

from __future__ import absolute_import

import json
import os

from b2share import __version__
from b2share.modules.records.providers import RecordUUIDProvider
from flask import Blueprint, abort, current_app, jsonify, request
from invenio_files_rest import models as fm
from invenio_records.api import Record
from invenio_rest import ContentNegotiatedMethodView

blueprint = Blueprint('b2share_apiarchive', __name__, url_prefix='/archive')

BRIDGE_URL = os.environ.get('BRIDGE_URL',
                            'http://localhost:8592/api/v1') + '/archiving'
BRIDGE_API_KEY = os.environ.get('BRIDGE_APIKEY', 'akmi')
B2SHARE_ARCHIVE_URL = os.environ.get(
    'B2SHARE_PREFERRED_URL_SCHEME', 'http') + '://' + os.environ.get(
        'B2SHARE_JSONSCHEMAS_HOST', 'localhost:5000') + '/api/archive'


class ApiArchive(ContentNegotiatedMethodView):
    def __init__(self, resolver=None, **kwargs):
        """Constructor.
        :param resolver: Persistent identifier resolver instance.
        """
        default_media_type = 'application/json'
        super(ApiArchive, self).__init__(
            serializers={
                'application/json': lambda response: jsonify(response)
            },
            default_method_media_type={
                'POST': default_media_type,
                'GET': default_media_type,
            },
            default_media_type=default_media_type,
            **kwargs)
        self.resolver = resolver

    def get(self, **kwargs):
        input_record = request.args.get('r')
        if input_record is None:
            return abort(400)

        try:
            rec_pid = RecordUUIDProvider.get(input_record).pid
            record = Record.get_record(rec_pid.object_uuid)
            for file in record.get('_files', []):
                fmimetype = fm.ObjectVersion.get(
                    file.get('bucket'), file.get('key'),
                    file.get('version_id')).mimetype
                file.update({'mimetype': fmimetype})
                file_location = current_app.config.get(
                    'PREFERRED_URL_SCHEME',
                    '') + '://' + current_app.config.get(
                        'JSONSCHEMAS_HOST', '') + '/api/files/' + file.get(
                            'bucket') + '/' + file.get('key')
                file.update({'file-location': file_location})
                file_name = file.get('key')
                file.update({'name': file_name})
            return record
        except:
            return abort(404)

    def post(self, **kwargs):
        content = request.json
        input_record = content['record']
        version_record = content['version']

        if (input_record or version_record) is None:
            return abort(400)

        bridge_dar_username = os.environ.get('BRIDGE_DAR_USERNAME', 'akmi')
        bridge_dar_password = os.environ.get('BRIDGE_DAR_PASSWORD', 'akmi')
        try:
            import urllib2 as http
        except ImportError:
            from urllib import request as http

        try:

            postdata = {
                "darData": {
                    "darName": "EASY",
                    "darPassword": bridge_dar_password,
                    "darUserAffiliation": "B2SHARE",
                    "darUsername": bridge_dar_username
                },
                "srcData": {
                    "srcApiToken": BRIDGE_API_KEY,
                    "srcMetadataUrl": B2SHARE_ARCHIVE_URL + '?r=' + input_record,
                    "srcMetadataVersion": version_record,
                    "srcName": "b2share"
                }
            }

            req = http.Request(BRIDGE_URL)
            req.add_header('Accept', 'application/json')
            req.add_header('Content-Type', 'application/json')
            req.add_header('api_key', BRIDGE_API_KEY)
            jsondataasbytes = json.dumps(postdata).encode('utf-8')
            response = http.urlopen(req, jsondataasbytes)

            # f = http.urlopen(req)
            content = response.read()
            response.close()
            return content

        except http.HTTPError as rps:
            print('HTTPError')
            print(rps)

        return abort(500)


class ApiArchiveState(ContentNegotiatedMethodView):
    def __init__(self, resolver=None, **kwargs):
        """Constructor."""
        default_media_type = 'application/json'
        super(ApiArchiveState, self).__init__(
            serializers={
                'application/json': lambda response: jsonify(response)
            },
            default_method_media_type={
                'GET': default_media_type,
            },
            default_media_type=default_media_type,
            **kwargs)
        self.resolver = resolver

    def get(self, **kwargs):
        input_record = request.args.get('r')
        smv = request.args.get('srcMetadataVersion')
        if (input_record or smv) is None:
            return abort(400)

        try:
            import urllib2 as http
        except ImportError:
            from urllib import request as http

        try:
            rec_pid = RecordUUIDProvider.get(
                input_record).pid  # When the given record doesn't exist, throw exception
            smu = B2SHARE_ARCHIVE_URL + "?r=" + input_record
            bridge_url_state = \
                BRIDGE_URL + "/state?srcMetadataUrl=" + smu \
                + "&srcMetadataVersion=" + smv \
                + "&targetDarName=EASY"
            req = http.Request(bridge_url_state)
            req.add_header('Accept', 'application/json')
            req.add_header('Content-Type', 'application/json')

            response = http.urlopen(req)
            content = response.read()
            response.close()
            dict_content = json.loads(content.decode('utf-8'))
            state = dict_content['state']
            if state == 'ARCHIVED':
                return self.make_response({
                    'state': state,
                    'pid': dict_content['landingPage']
                })
            else:
                return self.make_response({'state': state})

        except http.HTTPError as e:
            if e.code == 404:
                print("Response code 404")
            else:
                print("Response code: " + e)
            return abort(404)


blueprint.add_url_rule('', view_func=ApiArchive.as_view('info'))
blueprint.add_url_rule('/state', view_func=ApiArchiveState.as_view('state'))
