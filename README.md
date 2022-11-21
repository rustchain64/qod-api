# qod-api

Quote of the Day API

### Ports
This API service listens on port `8080`. Please set the service to use port 8080, either when deploying from Dockerfile or Source-to-image, or by editing the service definition after deployment. This is the default port used for most OpenShift deployment.

### Environment Varaiables
Required environment variables that are required to connect to the database tier:
- **DB_HOST** - the hostname or IP address of the database instance, assuming use of port 3306 (In case of OpenShift, use service name of the qod-db deployment)
- **DB_USER** - the username of a user with access to the database (qod-db deployment uses `user`)
- **DB_PASS** - the password for the user above (qod-db deployment uses `pass`)

### Verify ### Environment Varaiables with api deployment and secret
Might me luke / secret


CREATE TABLE `programming_languages`
(
  `id`            INT(11) NOT NULL auto_increment ,
  `name`          VARCHAR(255) NOT NULL ,
  `released_year` INT NOT NULL ,
  `githut_rank`   INT NULL ,
  `pypl_rank`     INT NULL ,
  `tiobe_rank`    INT NULL ,
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`),
  UNIQUE `idx_name_unique` (`name`(255))
)

CREATE TABLE `pie_users`
(
  `id`            INT(11) NOT NULL auto_increment,
  `firstName`          VARCHAR(255) NOT NULL ,
  `lastName`          VARCHAR(255) NOT NULL ,
  `username`          VARCHAR(255) NOT NULL ,
  `agentCode`          VARCHAR(255) NOT NULL ,
  `persona`          VARCHAR(255) NOT NULL ,
  `hash`          VARCHAR(255) NOT NULL ,  
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  `updated_at`    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`),
  UNIQUE `idx_name_unique` (`username`(255))
)

    persona: { type: String, required: true },
    agentCode: { type: String, optional: true },
    username: { type: String, unique: true, required: true },
   
    hash: { type: String, required: true },
   
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }



##########################################################################

INSERT INTO pie_users (id,firstName,lastName,username,agentCode,persona,hash)
VALUES
(1, 'James', 'Bond', 'secret', 'testcode', 'agent', 'agent'),
(2, 'Super', 'Admin', 'superman', 'testcode', 'admin', 'hero123'),
(3, 'Carson', 'Cook', 'captain', 'testcode', 'admin', 'cook'),
(4, 'Briton', 'Stender', 'thai', 'testcode', 'admin', 'land');

    ###############################################################
INSERT INTO pie-users(id,name,released_year,githut_rank,pypl_rank,tiobe_rank) 
VALUES 
(1,'JavaScript',1995,1,3,7);
