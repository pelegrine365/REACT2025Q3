import type { BasePokemon } from '@types';

import './index.css';
import { useDispatch } from 'react-redux';
import { clearSelectedItems } from 'store/selectedItemsSlice';
import { downloadCsv } from '@utils/downloadCsv';

interface BulkActionsToolbarProps {
  selectedItems: BasePokemon[];
}

const BulkActionsToolbar = ({ selectedItems }: BulkActionsToolbarProps) => {
  const dispatch = useDispatch();

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearSelectedItems());
  };

  const handleDownload = () => {
    downloadCsv(
      `${selectedItems.length}_pokemon${selectedItems.length > 1 ? 's' : ''}.csv`,
      selectedItems
    );
    console.log('Downloading selected items:', selectedItems);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-content">
        <div className="toolbar-count">
          {selectedItems.length}{' '}
          {selectedItems.length === 1 ? 'item is' : 'items are'} selected
        </div>
        <div className="toolbar-actions">
          <button
            className="toolbar-button toolbar-button-unselect"
            onClick={handleUnselectAll}
          >
            Unselect all
          </button>
          <button
            className="toolbar-button toolbar-button-download"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsToolbar;
