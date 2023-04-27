#!/usr/bin/env sh

SOURCE='../../../src'
DIST=`pwd`

EXCLUDE={'file1.txt','dir1/*','dir2'}
OPTION='-avr'

# root static
rsync ${OPTION} --exclude ${EXCLUDE} ${SOURCE}/_root/ ${DIST}

# static projects
#rsync ${OPTION} --exclude ${EXCLUDE} ${SOURCE}/examples-pwa-camera/ ${DIST}/examples-pwa-camera/
