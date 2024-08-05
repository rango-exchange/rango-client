import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgDiscord(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.899 2.27191C15.0314 2.01005 15.312 1.8574 15.6037 1.88852C17.4166 2.08189 19.3694 2.48267 21.2253 3.77553C21.3465 3.85999 21.4382 3.98039 21.4874 4.11973C22.6789 7.49582 23.3304 10.4412 23.5822 12.8075C23.831 15.1462 23.6985 17.0009 23.2414 18.1433C23.2341 18.1615 23.2261 18.1794 23.2173 18.1969C22.7981 19.0347 22.1662 19.9871 21.3855 20.7411C20.6151 21.485 19.6146 22.1155 18.4694 22.1155C18.1899 22.1155 17.9568 21.9886 17.8202 21.9015C17.6623 21.8009 17.5077 21.6704 17.3642 21.5322C17.0752 21.2538 16.7706 20.8856 16.4945 20.4912C16.2176 20.0956 15.955 19.6532 15.7588 19.2196C15.6653 19.0127 15.5791 18.7913 15.516 18.5666C13.1328 18.9857 10.8676 18.9857 8.48444 18.5666C8.4213 18.7913 8.33515 19.0127 8.24158 19.2196C8.04541 19.6532 7.78287 20.0956 7.50593 20.4912C7.22987 20.8856 6.92526 21.2538 6.63621 21.5322C6.49268 21.6704 6.33812 21.8009 6.18025 21.9015C6.04365 21.9886 5.81054 22.1155 5.53101 22.1155C4.38587 22.1155 3.3853 21.485 2.61497 20.7411C1.83422 19.9871 1.2023 19.0347 0.783111 18.1969C0.774337 18.1794 0.766298 18.1615 0.759014 18.1433C0.30194 17.0009 0.169411 15.1462 0.418271 12.8075C0.670063 10.4412 1.32158 7.49582 2.51307 4.11973C2.56225 3.98039 2.65392 3.85999 2.77517 3.77553C4.63103 2.48267 6.58386 2.08189 8.3967 1.88852C8.68814 1.85743 8.96846 2.00972 9.101 2.27113L10.0165 4.07672C11.3338 3.89737 12.6694 3.89734 13.9868 4.07663L14.899 2.27191ZM7.09691 18.2788C6.71076 18.1869 6.32052 18.0845 5.92524 17.9716C5.55047 17.8645 5.33346 17.4739 5.44054 17.0991C5.54762 16.7244 5.93823 16.5074 6.313 16.6144C10.303 17.7544 13.6974 17.7544 17.6874 16.6144C18.0622 16.5074 18.4528 16.7244 18.5599 17.0991C18.667 17.4739 18.45 17.8645 18.0752 17.9716C17.6799 18.0845 17.2897 18.1869 16.9035 18.2788C16.9379 18.3842 16.9844 18.5042 17.0448 18.6378C17.1979 18.9761 17.4132 19.3423 17.6508 19.6818C17.8894 20.0226 18.1361 20.316 18.3433 20.5155C18.4381 20.6068 18.5125 20.6667 18.5638 20.7014C19.1559 20.6679 19.7871 20.3224 20.405 19.7257C21.0374 19.115 21.5762 18.3156 21.9413 17.5926C22.2618 16.7669 22.4174 15.2007 22.1786 12.9569C21.9455 10.7663 21.3448 8.00484 20.233 4.80813C18.8635 3.90803 17.4168 3.54109 15.9362 3.34881L15.0154 5.1705C14.8755 5.44734 14.5712 5.60035 14.2655 5.54759C12.7676 5.289 11.2364 5.289 9.73842 5.54759C9.43307 5.6003 9.12905 5.44766 8.98892 5.17128L8.06485 3.34872C6.58406 3.54098 5.13715 3.9079 3.76746 4.80813C2.65563 8.00484 2.05491 10.7663 1.82181 12.9569C1.58305 15.2007 1.73862 16.7669 2.05908 17.5926C2.42427 18.3156 2.96299 19.115 3.59544 19.7257C4.21334 20.3224 4.84451 20.6679 5.43667 20.7014C5.4879 20.6667 5.56232 20.6068 5.65716 20.5155C5.86433 20.316 6.11107 20.0226 6.34961 19.6818C6.58726 19.3423 6.80256 18.9761 6.95558 18.6378C7.01604 18.5042 7.0625 18.3842 7.09691 18.2788ZM5.38821 20.73C5.38826 20.7298 5.39117 20.7283 5.39677 20.726C5.39096 20.7291 5.38815 20.7303 5.38821 20.73ZM18.6122 20.73C18.6122 20.7302 18.6094 20.7291 18.6037 20.726C18.6093 20.7283 18.6122 20.7298 18.6122 20.73ZM7.14082 10.6693C7.49375 10.3163 7.97243 10.1181 8.47156 10.1181C8.97068 10.1181 9.44936 10.3163 9.8023 10.6693C10.1552 11.0222 10.3535 11.5009 10.3535 12C10.3535 12.4991 10.1552 12.9778 9.8023 13.3308C9.44936 13.6837 8.97068 13.882 8.47156 13.882C7.97243 13.882 7.49375 13.6837 7.14082 13.3308C6.78788 12.9778 6.58961 12.4991 6.58961 12C6.58961 11.5009 6.78788 11.0222 7.14082 10.6693ZM8.47156 11.5295C8.34678 11.5295 8.22711 11.5791 8.13887 11.6673C8.05064 11.7556 8.00107 11.8752 8.00107 12C8.00107 12.1248 8.05064 12.2445 8.13887 12.3327C8.22711 12.4209 8.34678 12.4705 8.47156 12.4705C8.59634 12.4705 8.71601 12.4209 8.80424 12.3327C8.89248 12.2445 8.94204 12.1248 8.94204 12C8.94204 11.8752 8.89248 11.7556 8.80424 11.6673C8.71601 11.5791 8.59634 11.5295 8.47156 11.5295ZM14.1981 10.6693C14.5511 10.3163 15.0297 10.1181 15.5289 10.1181C16.028 10.1181 16.5067 10.3163 16.8596 10.6693C17.2125 11.0222 17.4108 11.5009 17.4108 12C17.4108 12.4991 17.2125 12.9778 16.8596 13.3308C16.5067 13.6837 16.028 13.882 15.5289 13.882C15.0297 13.882 14.5511 13.6837 14.1981 13.3308C13.8452 12.9778 13.6469 12.4991 13.6469 12C13.6469 11.5009 13.8452 11.0222 14.1981 10.6693ZM15.5289 11.5295C15.4041 11.5295 15.2844 11.5791 15.1962 11.6673C15.108 11.7556 15.0584 11.8752 15.0584 12C15.0584 12.1248 15.108 12.2445 15.1962 12.3327C15.2844 12.4209 15.4041 12.4705 15.5289 12.4705C15.6537 12.4705 15.7733 12.4209 15.8616 12.3327C15.9498 12.2445 15.9994 12.1248 15.9994 12C15.9994 11.8752 15.9498 11.7556 15.8616 11.6673C15.7733 11.5791 15.6537 11.5295 15.5289 11.5295Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgDiscord;
