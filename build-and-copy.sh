gulp build --type=production

# app assets
cp dist/js/*.js ../duke-data-service/app/assets/javascripts/portal
#cp dist/js/*.js.map ../duke-data-service/app/assets/javascripts/portal
cp dist/css/*.css ../duke-data-service/app/assets/stylesheets/portal

# libraries
cp dist/lib/*.js ../duke-data-service/app/assets/javascripts/portal/lib
cp dist/lib/*.js.map ../duke-data-service/app/assets/javascripts/portal/lib
cp dist/lib/*.css ../duke-data-service/app/assets/stylesheets/portal/lib

