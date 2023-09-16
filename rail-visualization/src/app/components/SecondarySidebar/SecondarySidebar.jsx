import useSettings from 'app/hooks/useSettings';
import SecondarySidenavTheme from '../MatxTheme/SecondarySidenavTheme/SecondarySidenavTheme';
import SecondarySidebarContent from './SecondarySidebarContent';
import SecondarySidebarToggle from './SecondarySidebarToggle';

const SecondarySidebar = () => {
  const { settings } = useSettings();
  const secondarySidebarTheme = settings.themes[settings.secondarySidebar.theme];

  return (
    <SecondarySidenavTheme theme={secondarySidebarTheme}>
      {false && <SecondarySidebarContent />}
      
    </SecondarySidenavTheme>
  );
};

export default SecondarySidebar;
