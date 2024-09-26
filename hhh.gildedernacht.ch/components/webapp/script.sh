find . -type f -name "*.tsx" -print0 | xargs -0 sed -i "" -e "s/@/@hhh\/components\/webapp\//g"
find . -type f -name "*.ts" -print0 | xargs -0 sed -i "" -e "s/@/@hhh\/components\/webapp\//g"
