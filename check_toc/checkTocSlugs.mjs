import fetch from 'node-fetch';

async function printSlugs(toc) {
  function copy(o) {
    return Object.assign({}, o);
  }

  let newArr = [];

  async function printAllVals(obj) {
    for (let k in obj) {
      if (typeof obj[k] === 'object') {
        await printAllVals(obj[k]);
      } else {
        if (k == 'id') {
          newArr.push(obj[k]);
        }
      }
    }
    return newArr;
  }

  let resolve = copy(toc);
  let resItems = await printAllVals(resolve);
  return resItems;
}

async function getToc(projectId, branchId) {
      function manageErrors(response) {
        if (!response.ok) {
          if (response.status == 404) {
            throw Error(response.statusText);
          }
          return; // will print '200 - ok'
        }
        return response;
      }

  return fetch(
    `https://stoplight.io/api/v1/projects/${projectId}/table-of-contents?branch=${branchId}`
  )
    .then(manageErrors)
    .then((response) => response.json())
    .then((data) => printSlugs(data))
    .catch((error) => console.log(error));
}

async function checkTocSlugs(projectId, branchId) {

  const idArray = await getToc(projectId, branchId);

  // const asyncFunc = async () => {
  //     //   const unresolvedPromises = arr.map(n => calc(n));
  //     //   const unresolvedPromises = idArray.map(n => getStatus(n));
  //     const unresolvedPromises = idArray.map((n) => console.log(n));
  //     const results = await Promise.all(unresolvedPromises);
  //   };

  //   asyncFunc();

  //   function manageErrors(response) {
  //     if (!response.ok) {
  //       if (response.status == 404) {
  //         throw Error(response.statusText);
  //       }
  //       return; // will print '200 - ok'
  //     }
  //     return response;
  //   }
  function manageErrors(response) {
    if (!response.ok) {
      if (response.status == 404) {
        throw Error(response.statusText);
      }
      return; // will print '200 - ok'
    }
    return response;
  }

  let errors = [];

  function getStatus(slug) {
   fetch(
      `https://stoplight.io/api/v1/projects/${projectId}/nodes/${slug}?branch=master`
    )
      .then(manageErrors)
      .then((response) => response.json())
      .then((result) => null)
      .catch((error) => errors.push(slug));
  }

  //   function getStatus(slug) {
  //     return fetch(
  //       `https://stoplight.io/api/v1/projects/${projectId}/nodes/${slug}?branch=${branchId}`
  //     )
  //       .then(manageErrors)
  //       .then((response) => response.json())
  //       .then((result) => null)
  //       .catch((error) => console.log(slug));
  //   }

  idArray.map((slug) => {
    // let matchPattern = slug.match(/\d+/g);
    getStatus(slug);
    // matchPattern != null ? getStatus(slug) : null;
  });
console.log(errors)
  return errors;
}

checkTocSlugs('cHJqOjIwNjAz', 'test-slug-regen');
