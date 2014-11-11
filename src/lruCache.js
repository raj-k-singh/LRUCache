/*jslint browser : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/
/*global console*/

var LRUCache = LRUCache || {};

LRUCache.cache = function(_cacheSize){
    var cacheSize, occupancy, map, head, tail,                      // private variables
        _putInList, _removeFromList, _promoteInList, _dump,         // private methods
        get, put, peek, getCapacity, getOccupancy, remove, clear;   // public methods

    // Initialize private variables
    cacheSize = _cacheSize;
    occupancy = 0;
    map = {};
    head = null;
    tail = null;

    if(cacheSize < 1 )
    {
        throw new Error('LRU Cache must have a positive capacity : '+cacheSize+' provided');
    }


//-------- Begin Private and utility methods --------//
    /* 
        Utility method for adding a new item to the doubly linked list
        Removing items from the tail as needed if size overflows.
    */
    _putInList = function(data){
        // case for first element in cache
        if(head === null){
            head = data;
            tail = data;
            data.right = null;
        }
        else{
            head.left = data;
            data.right = head;
            head = data;
        }
        data.left = null;

        // If size has exceeded, trim from tail
        if(occupancy === cacheSize){
            delete map[tail.key];
            if(tail.left !== null){
                tail.left.right = null;
            }
            tail = tail.left;
        }
        else{
            occupancy+= 1;
        }
    };    // _putInList end

    /*
        Utility method to remove an item from the doubly linked list
    */
    _removeFromList = function(data){
        if(data.left !== null){
            data.left.right = data.right;
        }
        if(data.right !== null){
            data.right.left = data.left;
        }
        occupancy -= 1;
    };    // _removeFromList end

    /* 
        Utility method to promote a node to the head of the linked list 
    */
    _promoteInList = function(data){
        if(data === head){
            return;
        }    
        if(data === tail){
            tail = data.left;
        }
        if(data.left !== null){
            data.left.right = data.right;
        }
        if(data.right !== null){
            data.right.left = data.left;
        }
        head.left = data;
        data.right = head;
        data.left = null;
        head = data;
    };    // _promoteInList end

    _dump = function(){
        var list = "| ", tmp;
        tmp = head;
        while(tmp !== null){
            list += " <==> "+tmp.key;
            tmp = tmp.right;
        }
        list += "|";
        console.log('occupancy : ',occupancy,' ; cacheSize : ',cacheSize);
        console.log('list : ', list);
    };    // _toString end
//-------- End Private and utility methods --------//

//-------- Begin public methods --------//

    getCapacity = function(){
        return cacheSize;
    };    //     _getSize end

    getOccupancy = function(){
        return occupancy;
    };

    /*
        Retrive and item from the cache. This updates the last accessed property for the item
        Returns undefined if key not present in cache.
    */
    get = function(key){
        if(!map.hasOwnProperty(key)){
            return undefined;
        }
        // Promote item in linked list to signify its recent use.
        _promoteInList(map[key]);
        return map[key].value;
    };    // _get end

    /*
        Puts a new item in the cache. Making it the most recently used.
        If the key is already present in the cache, then the value is updated
        and the key's access priority is updated.
    */
    put = function(key, value){
        var data;
        // If the key already exists, then promote it and update value
        if(map.hasOwnProperty(key)){
            _promoteInList(map[key]);
            map[key].value = value;
        }
        else{   // insert a new node
            data = {
                key : key,
                value : value
            };
            _putInList(data);    
            map[key] = data;        
        }
    };    // _put end

    /*
        Remove item with the given key from cache
    */
    remove = function(key){
        if(!map.hasOwnProperty(key)){
            return;
        }
        _removeFromList(map[key]);
        delete map[key];
    };    // remove end

    /*
        Clears the cache
    */
    clear = function(){
        head = null;
        tail = null;
        map = {};
        occupancy = 0;
    };

    /*
        Peeks an item in the cache without changing its last access priority
    */
    peek = function(key){
        if(!map.hasOwnProperty(key)){
            return undefined;
        }
        return map[key].value;
    };    // peek end

//-------- End public methods --------//


    return {
        capacity : getCapacity,
        size : getOccupancy,
        get : get,
        put : put,
        remove : remove,
        clear : clear,
        peek : peek
    };
};

// Export self ( mainly for use with require )
if(typeof this === 'object'){
    this.LRUCache = LRUCache;
}
