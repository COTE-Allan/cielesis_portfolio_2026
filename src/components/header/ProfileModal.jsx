import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from '../menu_system/Panel';
import './ProfileModal.scss';

const PROFILE = {
  picture: 'https://picsum.photos/204',
  name: 'Allan "Cielesis" COTE',
  infos: [
    {icon: 'location_on', key: 'profile.location'},
    {icon: 'flag', key: 'profile.country'},
    {icon: 'work', key: 'profile.status'},
  ],
  skills: ['webDeveloper', 'webDesigner', 'artist', 'gameDeveloper'],
};

export function ProfileModal({modal}) {
  return (
    <Panel
      open={modal.isOpen}
      onClose={modal.hide}
      onExited={modal.onExited}
      label={t('profile.title')}
    >
      {modal.data && (
        <div className="profile">
          <PanelHeader onClose={modal.hide}>
            <h2 className="profile-title">
              <RoundIcon name="person" filled />
              {t('profile.title')}
            </h2>
          </PanelHeader>

          <div className="profile-identity">
            <img src={PROFILE.picture} alt={t('profile.pictureAlt', {name: PROFILE.name})} className="profile-picture" />
            <div>
              <p className="profile-name">{PROFILE.name}</p>
              <p className="profile-role">{t('profile.role')}</p>
            </div>
          </div>

          {/* paragraphs are separated by an empty line in the text. */}
          <div className="profile-bio">
            {t('profile.bio').split(/\n\s*\n/).map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <ul className="profile-infos">
            {PROFILE.infos.map(({icon, key}) => (
              <li key={icon} className="profile-info">
                <RoundIcon name={icon} />
                {t(key)}
              </li>
            ))}
          </ul>

          <ul className="profile-skills">
            {PROFILE.skills.map((skill) => (
              <li key={skill} className="profile-skill">{t(`profile.skills.${skill}`)}</li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}
