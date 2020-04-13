import React, { Component } from "react";
import styled, { css } from "styled-components";

function MaterialCardBasic({ imgSrc, text }) {
  return (
    <Container>
      <CardItemImagePlace
        src={imgSrc}
      ></CardItemImagePlace>
      <Body>
        <BodyText>
          { text }
        </BodyText>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: #FFF;
  flex-wrap: nowrap;
  border-radius: 2px;
  border-color: #CCC;
  border-width: 1px;
  overflow: hidden;
  flex-direction: column;
  border-style: solid;
  box-shadow: -2px 2px 1.5px  0.1px #000 ;
`;

const CardItemImagePlace = styled.img`
  flex: 1 1 0%;
  background-color: #ccc;
  min-height: 210px;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  padding: 16px;
  flex-direction: column;
  display: flex;
`;

const BodyText = styled.span`
  font-family: Arial;
  color: #424242;
  font-size: 14px;
  line-height: 20px;
`;

export default MaterialCardBasic;
