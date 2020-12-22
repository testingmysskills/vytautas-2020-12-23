# Vytautas - 2020-12-23
## Installation

> Before starting, make sure that no app is running on localhost 3000 and 3001 ports!

Backend
1. open `server-api` folder
2. run `yarn install` command
3. run `yarn start` to run server

Frontend
1. open `files-task` folder
2. run `yarn install` command
3. run `yarn start` to run application
4. open `http://localhost:3000` (should open automatically)

## Security

Addressed:
- Fetching 3rd part fonts, however using `integrity` attribute to ensure it's not changed
- Sanitizing search param query and input field before querying files
- No dangerous HTML is set in the application, all user input is escaped
- Attempt to prevent unauthorized directory traversal (during upload and delete) on the API side by
  sanitizing file names
- Limit uploaded files size both on client and server (10MB)
- Limit file types both on client and server (png/jpeg/jpg)
- Limit file name length on client and server (20 chars)
- Remove file extension when uploading (both client and server)
- Checked `yarn audit` results - 1 `low` severity vulnerability was detected - prototype pollution
- Server crash does not report stack trace
- CSP policy for FE application - whitelist font-src, API and scripts source, styles

**Not** addressed:
- Would host all assets locally
- Setup CORS configuration on the server side
- Setup HTTPS
- I read that `snyk` is more "powerful" than `yarn audit` so would add that for extra protection
- If application had CI pipeline would also add automatic dependency updates so application would be kept up to date
- Captcha could be added to prevent bots from uploading files
- Cleaning potentially dangerous meta data using Content Disarm & Reconstruction techniques
- Logging user activities
- Would also prevent inline scripts and styles from being ran, however because of hot-reload
  I decided to keep them for now
- Would use CSP with headers approach instead of meta tags

## Improvements
APP:
- Get rid of `!import` in styles to override MUI styles, with a bit more time would find a way to avoid them
- Typescript types could be overall improved, I would ditch all "any" types
- Error messages could be improved with more specific ones, also account for different error cases
- Some parts of the code could be further split into smaller units
- Could use react-router + query string parser to handle query changes and initialization but for
  now the scope is too small
- I would extend API response to include uploaded image name so that I wouldn't need to "guess" that on FE
- I would also add prettier to take care of extra formatting, however it requires a little bit more time 
  to properly configure so it works correctly with all other lint rules/presets
- Pagination could be added to handle large lists of uploads

API:
- Use only non-blocking calls inside node app (have a bunch of `sync` calls)
- Use some project structure
- Use some modular architecture, split the code
- Use linter for the code
- Right now duplicate file uploads are not handled, this should be addressed

Both:
- Name sanitization could be a little bit less "strict"

## Libraries
- `express` - simple http server for API
- `create-react-app` for main application scaffold
- `axios` - for communication between FE and API
- `moxios` - for mocking axios request in tests
- `@material-ui` - for UI components, icons, etc..
- `notistack` - so could programatically render notifications
- `react-highlight-words` - in order to highlight search term in uploads list
- `use-debounce` - to debounce fetching when search term is being entered
- `standard eslint preset` - big lint ruleset for consistent code style

## API

I decided to do a really simple `express` based API which satisfies application requirements.
However, I didn't use best practices thoroughly when designing API,
tried to follow RESTlike API closely, with much more time I would go for GQL API 

```
### GET /resources
// Description of the endpoint:
// - what does the endpoint do?
// - what does it return?
// - does it accept specific parameters?
```
```
GET /
Status endpoint to check if API is working
```

```
GET /uploads?searchTerm=string
returns array of uploaded files:

[
  { name, size }
]

optionally `searchTerm` can be passed so that only files filtered by name would be returned
```

```
GET /uploads/path-to-file.extension
static assets path, this is where uploaded files are fetched from
```

```
POST /upload
Upload file to the server, expects `file` to be send via FormData using 'multipart/form-data'
```

```
DELETE /upload/:file-name
Delete file on the server by specifying it's `file-name` as URL param
```

---
## Other notes
- I have decided to use Material UI for better looking UI, however writing such components from scratch with CSS 
  wouldn't be a problem either
- I added 1 second timeout on the server when loading images so that the loading skeletons could be seen
- If you slow down network you should also be able to see loading progress when image is being uploaded
- Tested in Chrome, Firefox, Edge. Haven't tested on older browsers
- Have not tested in on mobile browsers
- In wireframe button with DELETE text is shown, however I went with icon and tooltip for it,
  I found it look slightly better
- I intentionally left folders named `_template`, I'm using them to quickly create components or other units 
  by copy/pasting
- You might find the folder structure a bit "weird" but I look to keep all relevant files in the same place - 
  styles, test, source, etc... For that reason almost all "unit" has it's own folder
  
About testing:
- Since testing can take significant amount of time I didn't cover all or even majority of the code,
  instead I added specs for 3 different file types that are most common in this application:
  `util` (`calculateFileSize.test`), `hook` (`useLazyDelete.test`) and `component` (`FileInfo.test`).
  I believe that covering the rest of the application would be a repetition of similar principals and might not
  reveal many extra things in regards to how I approach testing. However if you would like I could do extra covered
  on demand
- I prefer behavioural testing approach where I try to stay away from implementation of the code as much as possible
  verifying it's functionality only via "visual" changes or checking how certain callbacks are called.
  I try to minimize the need to rely on mocks and whenever possible test using real implementation. It all mostly 
  depends on how well specs are performing without mocking
- 