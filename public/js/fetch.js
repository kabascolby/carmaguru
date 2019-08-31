export function api(route, options, callBack) {
    fetch(route, options)
        .then(result => {
            if (result.ok) {
                return result.json();
            } else {
                throw result.text();
            }
        })
        .then(resJSON => callBack(null, resJSON))
        .catch((err) => {
            callBack(err);
        });
}