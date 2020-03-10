export default function QuadTree(data = null,
                                 depth = 0,
                                 index = 0,
                                 children = null) {

  let maxDepth = 8;


  this.updateWithCondition = (shallFold, shallUpdate) => newData => {
    if (shallFold(data)) {
      foldChildrenToParent(newData);
    }
    if (shallUpdate(data)) {
      updateChildren(newData, (newChild) => {
        newChild.updateWithCondition(shallFold, shallUpdate, newData);
      });
    }
  };
  
  this.updateWithTree = (updateWithCondition, updateDataFn) => {
    if (children === null) {
      let newData = updateDataFn(data, index);
      if (newData) {
        updateWithCondition(newData);
      }
    } else {
      children.forEach(child => {
        child.update(updateDataFn);
      });
    }
  };

  const updateChildren = (newData, onUpdateChild) => {
    if (this.resDepth < maxDepth) {
      if (this.children === null) {
        createChildren(newData);
      }
      children.forEach(child => {
        onUpdateChild(child, newData);
      });

      clearRedundantChildren();
    } else foldChildrenToParent(newData);
  };

  const clearRedundantChildren = () => {
    
  };

  const foldChildrenToParent = (_data) => {
    children = null;
    data = _data;
  };

  const createChildren = (newData) => {
    for (let i = 0; i < 4; i++) {
      let newChild = new QuadTree(data, depth + 1, i);
      children.push(newChild);
    }
  };
  

}
