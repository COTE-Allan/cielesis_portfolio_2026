import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from '../menu_system/Panel';
import './ProfileModal.scss';

// placeholder content, to replace later.
const PROFILE = {
  picture: 'https://picsum.photos/204',
  name: 'Allan "Cielesis" COTE',
  role: 'Digital creator',
  bio: [
    'I’m a developer and designer specialized in web and video games, i love doing creative things for the internet. Open to work and collaborations.',
  ],
  infos: [
    {icon: 'location_on', label: 'Le Havre'},
    {icon: 'flag', label: 'France'},
    {icon: 'work', label: 'Open to work'}
    ],
  skills: ['Web Developper', 'Web Designer', 'Artist', 'Game Developper'],
};

// presentation of the creator, opened from the profile section of the header.
// `modal` is the useModal() of the profile.
export function ProfileModal({modal}) {
  return (
    <Panel
      open={modal.isOpen}
      onClose={modal.hide}
      onExited={modal.onExited}
      label="Profile"
    >
      {modal.data && (
        <div className="profile">
          <PanelHeader onClose={modal.hide}>
            <h2 className="profile-title">
              <RoundIcon name="person" filled />
              Profile
            </h2>
          </PanelHeader>

          <div className="profile-identity">
            <img src={PROFILE.picture} alt={`profile picture of ${PROFILE.name}`} className="profile-picture" />
            <div>
              <p className="profile-name">{PROFILE.name}</p>
              <p className="profile-role">{PROFILE.role}</p>
            </div>
          </div>

          <div className="profile-bio">
            {PROFILE.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <ul className="profile-infos">
            {PROFILE.infos.map(({icon, label}) => (
              <li key={icon} className="profile-info">
                <RoundIcon name={icon} />
                {label}
              </li>
            ))}
          </ul>

          <ul className="profile-skills">
            {PROFILE.skills.map((skill) => (
              <li key={skill} className="profile-skill">{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
