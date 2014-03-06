elastic-hq-proxy
================

Hosts [Elastic HQ](http://www.elastichq.org/) as a nodejs express application.

This application modified from [kibana-proxy](https://github.com/hmalphettes/kibana-proxy) from Hugues Malphettes' work.

Features:
- Proxy access to Elasticsearch: all elasticsearch queries are sent through the express application.
- Optional Google OAuth2 login with [passport](http://passport.org).
- Support for Elasticsearch protected by basic-authentication: only the express app will know about the username and password.

Usage
=====

```
git clone git@github.com:hmalphettes/kibana-proxy.git
git submodule update --init --recursive
npm install
node app.js &
open http://localhost:3003
```

Configuration
=============
Configuration is done via environment variables:
- `ES\_URL`: example: `http://user:password@your-elasticsearch.local`; default: `http://localhost:9200`
- `PORT`: the port where the app is run, default to `VCAP\_PORT` and then to `3003`.
- `APP\_ID`, `APP\_SECRET`: Google OAuth2 config. Optional.
- `AUTHORIZED\_EMAILS`: define what authenticated email is granted access; a comma separated listed of patterns; defaults to `*`. example: `*@stoic.com,justme@gmail.com` each pattern must be one-of:
    - `*`: anything,
    - `*@domain`: any email in the domain
    - `an@email`: a specific email.

License
=======
elastic-hq-proxy is freely distributable under the terms of the MIT license.

Copyright (c) 2014 Sho Sawada

Original version: Copyright (c) 2013 Sutoiku, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
