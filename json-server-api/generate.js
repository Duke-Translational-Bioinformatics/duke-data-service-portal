module.exports = function(){
    var faker = require('faker');
    var _ = require('lodash');
    return {
        projects: _.times(100, function(n){
            return {
                id: faker.random.uuid(),
                name: faker.lorem.sentence(),
                description: faker.hacker.phrase(),
                is_deleted: faker.random.boolean(),
                audit: {}
            }
        })
    }
}