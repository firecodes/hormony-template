import * as React from 'react';
import RightText from './RightText';
import RightImage from './RightImage';
import OrderInfoView from './OrderInfoView';
import LeftText from './LeftText';
import LeftImage from './LeftImage';

function RightMessageView(props) {
  if (props.item.type === 0) {
    return <RightText data={props.item} />;
  } else if (props.item.type === 1) {
    return <RightImage data={props.item} onImageClick={props.onImageClick} />;
  } else {
    return (
      <OrderInfoView data={props.item} onOrderClick={props.onOrderClick} />
    );
  }
}

export default RightMessageView;
