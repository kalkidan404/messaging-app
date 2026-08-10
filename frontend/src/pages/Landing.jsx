import { Link } from "react-router-dom";

function Landing() {
  return (
    <main>
      <h1>The Correspondence</h1>

      <p>
        A place for letters meant for someone.
      </p>

      <p>
        "There is no charm equal to tenderness of heart."
      </p>

      <div>
        <Link to="/login">
          Sign In
        </Link>

        <Link to="/register">
          Register
        </Link>
      </div>
    </main>
  );
}

export default Landing;