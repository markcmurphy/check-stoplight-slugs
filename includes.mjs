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

  return (
    fetch(
      `https://stoplight.io/api/v1/projects/${projectId}/table-of-contents?branch=${branchId}`
    )
      // .then(manageErrors)
      .then((response) => response.json())
      .then((data) => printSlugs(data))
      .catch((error) => console.log(error))
  );
}

async function checkTocSlugs(projectId, branchId) {
  // loop over project IDs
  for (let i = 0; i < projectId.length; i++) {
    const element = projectId[i];

    const idArray = await getToc(element, branchId);
    const masterArray = await getToc(element, 'master');
    // considered error if slug in branch is not included in master branch
    let errors = idArray.filter((slug) => masterArray.includes(slug) !== true);
    // console.log(errors);
    errors?.forEach((slug) => {
      fetch(
        `https://stoplight.io/api/v1/projects/${element}/nodes/${slug}?branch=${branchId}`
      )
        // .then(manageErrors)
        .then((response) => response.json())
        // .then((result) => result.uri)
        .then((result) => console.log('🚀 ~ result.uri', result.uri))
        .catch((error) => console.log(error));
    });
    // return errors;
    // end project ID loop
  }
}

let apiRef = 'cHJqOjIwNjAz';
let devDocs = 'cHJqOjI4MDIz';
let testBranch = 'DEVDOCS-3283-allow-webhook-schemas';

let projectIdArr = [apiRef, devDocs];

checkTocSlugs(projectIdArr, testBranch);
