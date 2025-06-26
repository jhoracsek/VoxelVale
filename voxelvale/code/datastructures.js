class Queue{
	constructor(){
		this.queueArray=[]
		this.newEntryIndex=0;
	}
	empty(){
		this.queueArray=[];
		this.newEntryIndex=0;
	}
	enqueue(object){
		this.queueArray[this.newEntryIndex]=object;
		this.newEntryIndex++;
		return true;
	}
	dequeue(){
		if(this.isEmpty())
			return false;
		for(var i=0;i<this.newEntryIndex-1;i++){
			this.queueArray[i]=this.queueArray[i+1];
		}
		this.queueArray.pop();
		this.newEntryIndex--;
		return true;
	}	
	peek(){
		if(this.isEmpty() == false)
			return this.queueArray[0];
		return null;
	}
	//I keep breaking the rules, you can't stop me!
	removeElement(index){
		for(var i=index;i<this.newEntryIndex-1;i++)
			this.queueArray[i]=this.queueArray[i+1];
		this.newEntryIndex--;
	}
	//specifically for the notification queue :/
	peek5(){
		if(this.isEmpty())
			return null;
		var retArray=[];
		for(var i=0;i<Math.min(this.newEntryIndex,5);i++)
			retArray[i]=this.queueArray[i];
		return retArray;
	}
	cheekyPeek(){
		if(this.isEmpty())
			return null;
		return this.queueArray[this.newEntryIndex-1];
	}
	isEmpty(){
		if(this.newEntryIndex==0){
			return true;
		}
		return false;
	}
}

//This is inefficient, just a temporary fix.
class ProperArray extends Queue{
	constructor(){
		super();
	}
	push(OBJECT){
		this.enqueue(OBJECT);
	}
	//MAX AMOUNT OF ELEMENTS!!!!!!!!!!!!!!!
	
	getLength(){
		return this.newEntryIndex;
	}
	accessElement(i){
		return this.queueArray[i];
	}
}

class QueuedFunction{
	constructor(FUNCTION){
		this.function=FUNCTION;
	}
	run(){
		this.function();
		return;
	}
}



/*
	This is used for A* search (so pathfinding).
	https://www.geeksforgeeks.org/implementation-priority-queue-javascript/

	Items should be of the form [obj, key].
*/
class PriorityQueue{
	constructor(){
		this.heap = [];
	}

	/*
		Helper methods
	*/
	getLeftChildIndex(parentIndex){
		return 2*parentIndex + 1;
	}

	getRightChildIndex(parentIndex){
		return 2*parentIndex + 2;
	}

	getParentIndex(childIndex){
		return Math.floor((childIndex-1)/2);
	}

	hasLeftChild(index){
		return this.getLeftChildIndex(index) < this.heap.length;
	}

	hasRightChild(index){
		return this.getRightChildIndex(index) < this.heap.length;
	}

	hasParent(index){
		return this.getParentIndex(index) >= 0;
	}

	leftChild(index){
		return this.heap[this.getLeftChildIndex(index)];
	}

	rightChild(index){
		return this.heap[this.getRightChildIndex(index)];
	}

	parent(index){
		return this.heap[this.getParentIndex(index)];
	}

	swap(indexOne, indexTwo){
		const temp = this.heap[indexOne];
		this.heap[indexOne] = this.heap[indexTwo];
		this.heap[indexTwo] = temp;
	}

	peek(){
		if(this.heap.length === 0){
			return null;
		}else{
			return this.heap[0];
		}
	}

	isEmpty(){
		if(this.heap.length === 0)
			return true;
		return false;
	}

	remove(){
		if(this.heap.length === 0) return null;

		const item = this.heap[0];
		this.heap[0] = this.heap[this.heap.length - 1];
		this.heap.pop();
		this.heapifyDown();
		return item;
	}

	add(item){
		this.heap.push(item);
		this.heapifyUp();
	}

	/*
		Comparisons are only performed in the heapify functions.
	*/
	heapifyUp(){
		let index = this.heap.length - 1;
		//Find place in tree
		while(this.hasParent(index) && this.parent(index)[1] > this.heap[index][1]){
			this.swap(this.getParentIndex(index), index);
			index = this.getParentIndex(index);
		}
	}

	heapifyDown(){
		let index = 0;

		//If there is a right index then there is a left index, 
		//so this condition is sufficient.
		while(this.hasLeftChild(index)){
			let smallerChildIndex = this.getLeftChildIndex(index);
			if(this.hasRightChild(index) && this.rightChild(index)[1] < this.leftChild(index)[1]){
				smallerChildIndex = this.getRightChildIndex(index);
			}

			if(this.heap[index][1] < this.heap[smallerChildIndex][1]){
				break;
			}else{
				this.swap(index, smallerChildIndex);
			}
			index = smallerChildIndex;
		}

	}
}


















































