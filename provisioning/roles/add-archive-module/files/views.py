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

from flask import Blueprint, jsonify, current_app, request

from invenio_rest import ContentNegotiatedMethodView

from b2share import __version__


blueprint = Blueprint('b2share_apiarchive', __name__, url_prefix='/archive')


class ApiArchive(ContentNegotiatedMethodView):

    def __init__(self, resolver=None, **kwargs):
        print(kwargs)
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
            },
            default_media_type=default_media_type,
            **kwargs)
        self.resolver = resolver

    def get(self, **kwargs):
        b2access = current_app.config.get('OAUTHCLIENT_REMOTE_APPS', {}).get(
            'b2access', {})
        data = {
            'version': __version__,
            'eko': 'indarto999---',
            'site_function': current_app.config.get('SITE_FUNCTION', ''),
            'training_site_link': current_app.config.get('TRAINING_SITE_LINK', ''),
            'b2access_registration_link': b2access.get('registration_url'),
            'b2note_url': current_app.config.get('B2NOTE_URL'),
            'terms_of_use_link': current_app.config.get('TERMS_OF_USE_LINK'),
        }
        response = jsonify(data)
        return response

    def post(self, **kwargs):
        print(request.data)
        import json
        try:
            import urllib2 as http
        except ImportError:
            from urllib import request as http

        print('--0--')
        try:
            print('--1--')
            response = http.urlopen('http://localhost:5000/vag')
            content = response.read()
            response.close()
            print('--2--')
            dict_content = json.loads(content.decode('utf-8'))
            print(content)

        except http.HTTPError as response:
            print('--error--')
            content = response.read()
            response.close()

        data = {
            "dans": 'knaw',
        }
        response = jsonify(data)
        return self.make_response({
            'message':'The record is -----reported.'
        })

blueprint.add_url_rule('/', view_func=ApiArchive.as_view('info'))
