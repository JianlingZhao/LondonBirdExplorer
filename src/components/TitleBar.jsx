import "../styles.css";

function TitleBar({ onOpenReadme }) {

  return (

    <div className="header">

      <h2 className="header-truetitle">
        London Bird Observation Explorer
      </h2>


    
    <div className="header-right">

        <span
          className="header-readme"
          onClick={onOpenReadme}
        >
          Readme
        </span>

        <span className="header-separator">
          |
        </span>

        <a
          className="header-github"
          href="https://github.com/JianlingZhao/jianlingzhao.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>

        <span className="header-separator">
          |
        </span>

        <span className="header-version">
          v1.0.0
        </span>

    </div>

    </div>
    
  );
}
export default TitleBar;