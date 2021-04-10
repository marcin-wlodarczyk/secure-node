# Node.js security - Auth0 Tutorial

## User Authentication

Each type of user is allowed to create an account in the system. We will achieve that by using `Auth0` identity provider.
More details at [Auth0 Get Started](https://auth0.com/docs/get-started)

## Setup Guide:

1. Create Auth0 account

2. Login to [Auth0 dashboard](https://manage.auth0.com/dashboard)

3. In left-top corner expand the dropdown and click Create tenant

4. Choose your Tenant Domain. 
   
    For example, I'll create: `secure-node`
    **Important!**
    Make sure that Region: `Europe` is selected.

    At the end your tenant domain should look like: `secure-node.eu.auth0.com`

5. Navigate to left panel and in `Applications -> APIs` section click `+ CREATE API`

    - Choose a name of your API. I'll go with `Secure Node API`
    - Create a logical identifier of your API (Using URL). I'll proceed with `https://secure-node-api`
    - Keep the default Signing Algorithm (`RS256`)
    - Click Create button

    You should be redirected to `Quick Start` tab in your newly created API.

6. Select `Node.js` in the code example section. Now we must take a note of few very important values.
   
    - jwksUri (In my case it's: `https://secure-node.eu.auth0.com/.well-known/jwks.json`)
    - audience (In my case it's: `https://secure-node-api`)
    - issuer (In my case it's: `https://secure-node.eu.auth0.com/`)

    Those values correspond to the following ENV variables located in `docker-compose.yml` file:
    
    - AUTH0_JWKS_URI
    - AUTH0_AUDIENCE
    - AUTH0_ISSUER

7. Right now we must edit our `docker-compose.yml` file accordingly.

After editing my API's ENV looks like:

```yml
environment:
    NODE_ENV: development
    
    AUTH0_JWKS_URI: https://secure-node.eu.auth0.com/.well-known/jwks.json
    AUTH0_AUDIENCE: https://secure-node-api
    AUTH0_ISSUER: https://secure-node.eu.auth0.com/
    
    AUTH0_APP_METADATA_CLAIM: https://secure-node-example/claims/app_metadata
```

*Please note there is one extra ENV variable called `AUTH0_APP_METADATA_CLAIM` we will need it for the next part of this tutorial. For now you can replace value `secure-node-example` with the identifier of your choice. 

8. Now we're ready to build our API and obtain token.

9. First let's build it by executing (PS. Make sure that you have Docker installed and running. More details at [Docker Get Started](https://www.docker.com/get-started)) 
```
./services.sh build
```
Expected output: `Building api ... done`

10. Next we'll start API's process by executing:
```
./services.sh start
```
Expected output: `[App]: Listening on port 80`

That means that API listens on port 80 but inside docker container, however in docker-compose.yml you can notice port forwarding configuration ("3000:80"). So by requesting localhost:80 we'll reach our API's container.

11. Let's test if API is responding:

```
curl http://localhost:3000/api/ping
```
Expected output: `{"message":"pong"}` 

```
curl http://localhost:3000/api/protected
```
Expected output: `{"message":"No authorization token was found"}`

You can see that second route is protected by the Express Middleware that expect JWT token.

12. To obtain the token Auth0 provides an easy way via Test Application (`Navigate -> Applications > Applications > Your API (Test Application)`):

In Quick Start you will find cURL request to obtain `access_token`

In my case it looks like:
```
curl --request POST \
  --url https://secure-node.eu.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"<SOME ID>","client_secret":"<SUPER SECRET>","audience":"https://secure-node-api","grant_type":"client_credentials"}'
```

13. After sending the request I got my `access_token`.

14. Let's call now our protected route with the `access_token` included.
```
curl --request GET \
  --url 'http://localhost:3000/api/protected' \
  --header 'authorization: Bearer <access_token goes here>'
```
Expected output: `{"message":"Hello CK5xkfN9WWL3tuZTgYvJq6hmh1G0OPJf@clients from the protected route!"}`

Where `CK5xkfN9WWL3tuZTgYvJq6hmh1G0OPJf@clients` is my userID.


## User Authorization

For this step you will need what's called "Metadata Claims" to authorize user based on its role.
More about it at [this link](https://auth0.com/docs/scopes/sample-use-cases-scopes-and-claims#add-custom-claims-to-a-token)

# Quick Start

## 1. Build

```
./services.sh build
```

## 2. Start

```
./services.sh start
```

## 3. Test

```
# Ping located on open route
curl http://localhost:3000/api/ping

# Protected route - should fail with {"message":"No authorization token was found"}
curl http://localhost:3000/api/protected
```

## 4. To make auto-reload on code changes run in separated terminal
```
npm run build:watch
```

## Contact
Created by *Marcin Włodarczyk* ([marcin@ipb.pt](mailto:marcin@ipb.pt)) - Feel free to contact me!

## License
[ISC](https://opensource.org/licenses/ISC)
