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

from flask import Blueprint, jsonify, current_app, request, abort

from invenio_rest import ContentNegotiatedMethodView
from invenio_files_rest import models as fm
from invenio_records.api import Record
from b2share.modules.records.providers import RecordUUIDProvider

from b2share import __version__

blueprint = Blueprint('b2share_apiarchive', __name__, url_prefix='/archive')

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
                'GET': default_media_type,
            },
            default_media_type=default_media_type,
            **kwargs)
        self.resolver = resolver

    def get(self, **kwargs):
        r = request.args.get('r')
        try:
            rec_pid = RecordUUIDProvider.get(r).pid
            record = Record.get_record(rec_pid.object_uuid)
            for f in record.get('_files', []):
                fmimetype = fm.ObjectVersion.get(f.get('bucket'), f.get('key'), f.get('version_id')).mimetype
                pid = f.get('bucket')
                f.update({'mimetype': fmimetype})
                fileLocation = current_app.config.get('PREFERRED_URL_SCHEME', '') + '://' + current_app.config.get('JSONSCHEMAS_HOST', '') + '/api/files/' + f.get('bucket') + '/' + f.get('key')
                f.update({'file-location': fileLocation})
            return record
        except:
            return abort(404)

blueprint.add_url_rule('/', view_func=ApiArchive.as_view('info'))
