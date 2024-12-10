namespace("frc2181.scouting.google-sheets-poc.HttpClient", {}, () => {
  const request = function({ method, path, payload, headers, onSuccess, onStateChange, onFailure}) {
    const xhttp = new XMLHttpRequest();
    Object.entries(headers).forEach(([ header, value ]) => {
      xhttp.setRequestHeader(header, value);
    });
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          onSuccess({
            responseText: this.responseText,
            headers: this.getAllResponseHeaders()
          });
        } else {
          if (onFailure) {
            onFailure({
              requestedFile: filepath,
              status: this.status,
              statusText: this.statusText,
              responseText: this.responseText,
            });
          }
        }
      } else {
        if (onStateChange) {
          onStateChange({
            state: this.readyState,
            min: 0,
            max: 4,
          });
        }
      }
    };
    xhttp.open(method, path, true);
    if (payload) {
      xhttp.send(payload);
    } else {
      xhttp.send();
    }
  };
  return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTION'].reduce((out, method) => {
    out[method.toLowerCase()] = ((opts) => request(Object.assign(opts, { method })));
    return out;
  }, { request });
});
