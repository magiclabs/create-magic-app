import Header from './header';

const Layout = (props) => (
  <>
    <Header />

    <main>
      <div className='container'>{props.children}</div>
    </main>

    <footer>
      Powered by <img src='/magic.png' alt='Magic Logo' className='footer-img' />
    </footer>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');
      *,
      *::before,
      *::after {
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
        outline: none;
      }
      body {
        margin: 0;
        color: #333;
        background-color: #fff;
        min-height: 100%;
      }
      .container {
        max-width: 42rem;
        margin: 0 auto;
        padding: 2rem 1.25rem;
        ovreflow: auto;
      }
      footer {
        width: 100%;
        height: 70px;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: center;
        bottom: 0px;
        position: fixed;
        align-items: center;
        clear: both;
      }
      .footer-img {
        height: 28px;
        margin-left: 10px;
      }
    `}</style>
  </>
);

export default Layout;
