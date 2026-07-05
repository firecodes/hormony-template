import * as React from 'react';
import LeftText from './LeftText';
import LeftImage from './LeftImage';
import OrderInfoView from './OrderInfoView';

function LeftMessageView(props) {
  if (props.item.type === 0) {
    return <LeftText data={props.item} />;
  } else if (props.item.type === 1) {
    return <LeftImage data={props.item} onImageClick={props.onImageClick} />;
  } else {
    return (
      <OrderInfoView data={props.item} onOrderClick={props.onOrderClick} />
    );
  }
}

export default LeftMessageView;
