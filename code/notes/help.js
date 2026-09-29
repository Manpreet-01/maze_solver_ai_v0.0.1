/**
 * In Chrome DevTools, queryObjects(Constructor) is the most direct way 
 * to find all live instances of a specific class in the heap.
 */
queryObjects(Agent);

/**
 * If you have a plain object (e.g., from JSON.parse) and want to 
 * map its properties onto a new instance of the Agent class:
 */
const plainObject = JSON.parse('{"name": "Agent Smith", "id": 7}');
const realAgent = Object.assign(new Agent(), plainObject);
console.log(realAgent);

/**
 * If the Agent class is not globally accessible, or you need to find 
 * where it is stored on the window object:
 */
(function findAgentInstances() {
  const instances = [];
  
  // Recursive search or global property check
  for (let prop in window) {
    try {
      if (window[prop] instanceof Agent) {
        instances.push({ key: prop, instance: window[prop] });
      }
    } catch (e) {
      // Ignore cross-origin or restricted properties
    }
  }

  console.table(instances);
})();

/**
 * To trigger a console log of all instances specifically using 
 * the Console Utilities API shorthand:
 */
// 1. Run: queryObjects(Agent)
// 2. Right-click the output and select "Store as global variable"
// 3. Or use the callback version:
queryObjects(Agent, (instances) => {
  console.log('Total Agent instances found:', instances.length);
  console.log(instances);
});
