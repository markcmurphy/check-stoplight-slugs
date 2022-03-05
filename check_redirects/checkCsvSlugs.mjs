import fetch from 'node-fetch';

const checkCsv = (csv, projectId) => {
  for (let k of csv) {
    let slug = k.split('/').slice(-1)[0].split('-')[0];
    // console.log(slug)

    function manageErrors(response) {
      if (!response.ok) {
        if (response.status == 404) {
          throw Error(response.statusText);
        }
        return; // will print '200 - ok'
      }
      return response;
    }

    function getStatus(slug) {
      fetch(`https://stoplight.io/api/v1/projects/${projectId}/nodes/${slug}`)
        .then(manageErrors)
        .then((response) => response.json())
        //   .then((result) => console.log(result.id))
        .then((result) => null)
        //   .catch((error) => console.log(`${slug} - ${error}`));
        .catch((error) => console.log(`${slug}`));
    }

    let matchPattern = slug.match(/\d+/g);

    matchPattern != null ? getStatus(slug) : null;
  }
};
