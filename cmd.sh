#!/bin/bash
set -e

if [ "$NODE_ENV" = "production" ]
then
  echo "NODE_ENV=production"
  exec npm start
elif [ "$NODE_ENV" = "testing" ]
then
  echo "NODE_ENV=testing"
  exec npm test
else
  echo "NODE_ENV=development"
  exec npm run dev
fi
