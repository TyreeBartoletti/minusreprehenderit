class Options {
  constructor () {
    this.https = false;
    this.host = null;
    this.port = 35729;

    this.snipver = null;
    this.ext = null;
    this.extver = null;

    this.mindelay = 1000;
    this.maxdelay = 60000;
    this.handshake_timeout = 5000;
  }

  set (name, value) {
    if (typeof value === 'undefined') {
      return;
    }

    if (!isNaN(+value)) {
      value = +value;
    }

    this[name] = value;
  }
}

Options.extract = function (document) {
  for (const element of Array.from(document.getElementsByTagName('script'))) {
    var m; var mm;
    var src = element.src; var srcAttr = element.getAttribute('src');
    var lrUrlRegexp = /^([^:]+:\/\/([^/:]+)(?::(\d+))?\/|\/\/|\/)?([^/].*\/)?z?livereload\.js(?:\?(.*))?$/;
    //                   ^proto:// ^host       ^port     ^//  ^/   ^folder
    if ((m = src.match(lrUrlRegexp)) && (mm = srcAttr.match(lrUrlRegexp))) {
      const [, , host, port, , params] = m;
      const [, , , portFromAttr] = mm;
      const options = new Options();

      options.https = element.src.indexOf('https') === 0;

      options.host = host;
      options.port = port
        ? parseInt(port, 10)
        : portFromAttr
          ? parseInt(portFromAttr, 10)
          : options.port;

      if (params) {
        for (const pair of params.split('&')) {
          var keyAndValue;

          if ((keyAndValue = pair.split('=')).length > 1) {
            options.set(keyAndValue[0].replace(/-/g, '_'), keyAndValue.slice(1).join('='));
          }
        }
      }

      return options;
    }
  }

  return null;
};

exports.Options = Options;
