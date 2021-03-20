#!/bin/bash

build_flag=False
cd packages
for dir in $(ls .)
do   
  [ -d ${dir} ] && echo "current package is: "${dir}
  name=`head -2 ${dir}/package.json |tail -1|awk -F '"' '{print $4}'`
  version=`head -3 ${dir}/package.json |tail -1|awk -F '"' '{print $4}'`
  check_registry=`npm view ${name}@${version} 2>&1`
  echo ${check_registry}
  check_publish=`echo ${check_registry} |grep "published"`

 if [ -z "${check_publish}" ]; then
    build_flag=True;
    break;
  fi
done

cd ..
if [ ${build_flag} = True ]; then
    npm run init || exit 1;
    git add .;
    git commit -m "update package version";  
    lerna publish from-package --yes || exit 1;
else
    echo "checked registry exist same version, so should not publish again!";
    exit 0;
fi