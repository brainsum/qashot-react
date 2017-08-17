import { schema } from 'normalizr';

// Define a scenario schema.
const scenario = new schema.Entity('scenarios');

// Define a viewport schema.
const viewport = new schema.Entity('viewports');

// Define a metadata lifetime schema.
const metadata_lifetime = new schema.Entity('metadata_lifetimes');

// Define a results schema.
const result = new schema.Entity('results');

// Define a queue schema.
const queue = new schema.Entity('queue', schema, {idAttribute: 'tid'});

// Define your entity short list schema.
const entityShortList = new schema.Entity('tests', {
  metadata_last_run: [ metadata_lifetime ],
  metadata_lifetime: [ metadata_lifetime ]
});

// Define your test lister.
export const testListerSchema = new schema.Object({
  entity: [ entityShortList ]
});

// Define test schema.
export const testSchema = new schema.Entity('tests', {
  field_scenario: [ scenario ],
  field_viewport: [ viewport ],
  metadata_last_run: [ metadata_lifetime ],
  result: [ result ]
});

// Define run test respond data schema.
export const runRespondSchema = new schema.Object({
  entity: testSchema,
});

export const updateTestEntity = new schema.Object({
  updates: [ testSchema ]
});

export const queueEntity = new schema.Object({
  queue_datas: [ queue ]
});