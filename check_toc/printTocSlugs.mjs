import fetch from 'node-fetch';

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

  fetch(`https://stoplight.io/api/v1/projects/${projectId}/table-of-contents?branch=${branchId}`)
    .then(manageErrors)
    .then((response) => response.json())
    .then((data) => printSlugs(data))
    .catch((error) => console.log(error));
}

async function printSlugs(toc) {
  function copy(o) {
    return Object.assign({}, o);
  }
  let newArr = [];
  async function printAllVals(obj) {
    for (let k in obj) {
      // let nodeData = await getNodeData(obj.slug?.split('-')[0]);
      if (typeof obj[k] === 'object') {
        await printAllVals(obj[k]);
      } else {
        if (k == 'id') {
          newArr.push(obj[k]);
        }
      }
    }
    // return;
    return newArr;
  }

  let resolve = copy(toc);
  let resItems = await printAllVals(resolve);
  console.log(resItems);
  return resItems;
}

// mergeTags(toc)
getToc('cHJqOjIwNjAz', 'master')




