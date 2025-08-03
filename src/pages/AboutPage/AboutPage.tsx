import { AUTHOR_GITHUB_NAME } from '@constants';
import { useGithubUser } from '@hooks/useGithubUser';
import Spinner from '@components/Spinner';
import { useTheme } from '@hooks/useTheme';

import './index.css';

const About = () => {
  const { theme } = useTheme();
  const { avatarURL, userURL, isLoading, error } =
    useGithubUser(AUTHOR_GITHUB_NAME);

  return (
    <div className={`about-page theme-${theme}`}>
      <div className="main">
        <div className="about__container">
          <div className="about__content">
            <div className="about__section">
              <h2>Application Information</h2>
              <p>
                This Pokemon Cards application is a modern React application
                built with TypeScript that allows users to search and explore
                Pokemon data using the PokeAPI. The app features a responsive
                design with Pokemon-themed styling and provides detailed
                information about each Pokemon.
              </p>
            </div>

            {isLoading || error ? (
              <Spinner />
            ) : (
              <>
                <div className="about__section">
                  <h2>Author</h2>
                  <div className="about__author">
                    <p className="about__author-description">
                      <span>Created by:</span>
                      <img
                        className="about__avatar"
                        src={avatarURL}
                        alt="avatar"
                      />
                      <strong>{AUTHOR_GITHUB_NAME}</strong>
                    </p>

                    <a
                      href={userURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about__link about__link--github"
                      role="link"
                      aria-label="View GitHub Profile"
                    >
                      View GitHub Profile
                    </a>
                  </div>
                </div>
              </>
            )}

            <div className="about__section">
              <h2>Education</h2>
              <div className="about__course">
                <p>
                  This project was developed as part of the RS School React
                  course - a comprehensive program for learning modern React
                  development.
                </p>
                <a
                  href="https://rs.school/courses/reactjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about__link about__link--course"
                  role="link"
                  aria-label="Open RS School React course page"
                >
                  RS School React Course
                </a>
              </div>
            </div>

            <div className="about__section">
              <h2>Technologies Used</h2>
              <ul className="about__tech-list">
                <li>React 19</li>
                <li>TypeScript</li>
                <li>Vite</li>
                <li>React Router</li>
                <li>Vitest & Testing Library</li>
                <li>PokeAPI</li>
              </ul>
            </div>

            <div className="about__section">
              <h2>Features</h2>
              <ul className="about__features-list">
                <li>Search Pokemon by name</li>
                <li>Responsive design</li>
                <li>Pokemon-themed styling</li>
                <li>Detailed Pokemon information</li>
                <li>Fast and modern interface</li>
                <li>Comprehensive test coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
