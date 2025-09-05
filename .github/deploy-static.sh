#!/usr/bin/env sh

SOURCE='../packages'
DIST=`pwd`

EXCLUDE={'*.md','file1.txt','dir1/*','dir2'}
OPTION='-avr'

# root static
# rsync ${OPTION} --exclude ${EXCLUDE} ${SOURCE}/_root/ ${DIST}

# static projects
rsync ${OPTION} --exclude ${EXCLUDE} ${SOURCE}/examples-pwa-camera/ ${DIST}/examples-pwa-camera/
rsync ${OPTION} --exclude ${EXCLUDE} ${SOURCE}/examples-web-visualization/public ${DIST}/examples-web-visualization/
