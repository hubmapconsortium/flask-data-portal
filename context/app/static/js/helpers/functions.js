export function isEmptyArrayOrObject(val) {
  if (val.constructor.name === 'Object') {
    return Object.keys(val).length === 0;
  }
  if (val.constructor.name === 'Array') {
    return val.length === 0;
  }
  return false;
}

export function capitalizeString(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function replaceUnderscore(s) {
  return s.replace(/_/g, ' ');
}

export function readCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i !== ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function getTokenParam(groupsToken) {
  return groupsToken ? `?token=${groupsToken}` : '';
}

export function getAuthHeader(groupsToken) {
  return groupsToken
    ? {
        Authorization: `Bearer ${groupsToken}`,
      }
    : {};
}

export function throttle(fn, wait) {
  let previouslyRun;
  let queuedToRun;

  return function invokeFn(...args) {
    const now = Date.now();

    queuedToRun = clearTimeout(queuedToRun);

    if (!previouslyRun || now - previouslyRun >= wait) {
      fn(...args);
      previouslyRun = now;
    } else {
      queuedToRun = setTimeout(invokeFn.bind(null, ...args), wait - (now - previouslyRun));
    }
  };
}

export function tableToDelimitedString(rows, colNames, d) {
  const str = rows.reduce((acc, row) => {
    const rowStr = Object.values(row).join(d);
    return acc.concat('\n', rowStr);
  }, colNames.join(d));
  return str;
}

export function createDownloadUrl(fileStr, fileType) {
  return window.URL.createObjectURL(new Blob([fileStr], { type: fileType }));
}

export function getDefaultQuery() {
  return {
    bool: {
      must_not: ['next_revision_uuid', 'sub_status'].map((field) => ({
        exists: {
          field,
        },
      })),
    },
  };
}

export function addRestrictionsToQuery(query) {
  const { query: innerQuery, ...rest } = query;

  const defaultQuery = getDefaultQuery();

  const combinedQueries = innerQuery ? [innerQuery, defaultQuery] : [defaultQuery];

  return {
    query: {
      bool: {
        must: combinedQueries,
      },
    },
    ...rest,
  };
}

export function getSearchHitsEntityCounts(searchHits) {
  const counts = searchHits.reduce(
    (acc, { _source: { entity_type } }) => {
      if (!(entity_type in acc)) {
        // Support entities may be in the user's list.
        acc[entity_type] = 0;
      }
      const incrementedCount = acc[entity_type] + 1;
      return { ...acc, [entity_type]: incrementedCount };
    },
    { Donor: 0, Sample: 0, Dataset: 0 },
  );

  return counts;
}

export function getArrayRange(n) {
  return [...Array(n).keys()];
}

export function getDonorAgeString({ age_value, age_unit }) {
  if (!(age_value && age_unit)) {
    return '';
  }
  return [age_value, age_unit].join(' ');
}
