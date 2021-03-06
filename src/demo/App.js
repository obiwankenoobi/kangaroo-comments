import React from 'react';
import Comments from '../lib';
// import { SecondExample } from '../lib';

const App = () => (
  <div>
    {style}
    <Comments
      siteName={
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3ZWJzaXRlTmFtZSI6ImFub3RoZXJvbmUiLCJpYXQiOjE1MzY5OTQ3MTd9.TFCFRtHn9PPPawMTKus6zYWK9BLVj_pCiQ0quBX78PA'
      }
      pageName={'page14'}
    />
    <footer>
      <p className="footer-p text-center">
        built with{' '}
        <span role="img" aria-label="thinking">
          {' '}
          ❤️{' '}
        </span>{' '}
        by{' '}
        <a
          target="_blank"
          className="a-gh"
          href="https://github.com/obiwankenoobi"
        >
          @obiwankenoobi
        </a>
      </p>
    </footer>
  </div>
);

let style = (
  <style>
    {`
      .text-center {
        text-align:center;
      }
      .link {
        margin:7px;
      }
      a {
        text-decoration: none;
      }

      .comments-container {
        margin: 0 auto;
        width:100%;
      }
      .content-container {
        margin: 0 auto;
        width:95%;
        padding-top:50px;
        height:100%;
      }
      ul {
        list-style: none;
      }
      .check-icon {
        margin-right:5px;
        color:green;
      }
      code { 
        background: #f5f5f5; 
        padding:5px;
      }
      header {
        width:100%;
        height:50px;
        background-color:#f5f5f5
      }
      footer {
        width:100%;
        height:50px;
        background-color:#f5f5f5;

      }
      .title {
        height: 50px;
        line-height: 50px;
        white-space: nowrap;
        margin-left:5px;
      }
      .footer-p {
        height: 50px;
        line-height: 50px;
        white-space: nowrap;
        margin-left:5px;
      }
      .fab {
        cursor:pointer
      }
      body {
        background-color:#f4fcfd;
        padding:0px;
        margin:0px;
    }
    `}
  </style>
);

export default App;
