import React from 'react';
import AddItemForm from './components/Item/AddItemForm';
import ItemList from './components/Item/ItemList';

function App() {
  return (
    <div>
      <h1>RentCart – Add & View Items</h1>
      <AddItemForm />
      <hr />
      <ItemList />
    </div>
  );
}

export default App;
