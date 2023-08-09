import type { SvgIconPropsWithChildren } from '../components/SvgIcon';

import React, { createElement } from 'react';

import { SvgIcon } from '../components/SvgIcon';

function SvgWallet(props: SvgIconPropsWithChildren) {
  return createElement(
    SvgIcon,
    props,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.74995 18.1812L6.99996 17.807H6.99996L6.74995 18.1812ZM5.81879 17.25L6.19295 17L5.81879 17.25ZM18.1812 17.25L17.807 17L18.1812 17.25ZM17.25 18.1812L17 17.807L17.25 18.1812ZM17.25 7.50629L17 7.88045L17.25 7.50629ZM18.1812 8.43745L17.807 8.68746L18.1812 8.43745ZM6.74995 7.50629L6.99996 7.88045L6.74995 7.50629ZM5.81879 8.43745L6.19295 8.68746L5.81879 8.43745ZM12.1788 5.75721L12.0798 6.19617L12.1788 5.75721ZM13.5903 6.07572L13.6893 5.63676V5.63676L13.5903 6.07572ZM17.1655 7.37058L16.8416 7.68298V7.68298L17.1655 7.37058ZM8.38308 5.38869L8.53844 5.81102H8.53844L8.38308 5.38869ZM7.42372 5.97118L7.12008 5.63906V5.63906L7.42372 5.97118ZM6.13204 7.47492C6.06109 7.7131 6.19665 7.96371 6.43484 8.03466C6.67302 8.10562 6.92363 7.97005 6.99458 7.73187L6.13204 7.47492ZM17.0247 7.87627C17.1934 8.05879 17.4781 8.07 17.6606 7.90131C17.8431 7.73263 17.8543 7.44792 17.6856 7.26541L17.0247 7.87627ZM5.25 11.5781V11.1281C5.00147 11.1281 4.8 11.3296 4.8 11.5781H5.25ZM5.25 14.1094H4.8C4.8 14.3579 5.00147 14.5594 5.25 14.5594V14.1094ZM16.2188 16.6688C16.4673 16.6688 16.6688 16.4673 16.6688 16.2188C16.6688 15.9702 16.4673 15.7688 16.2188 15.7688V16.6688ZM15.375 15.7688C15.1265 15.7688 14.925 15.9702 14.925 16.2188C14.925 16.4673 15.1265 16.6688 15.375 16.6688V15.7688ZM11.1562 7.3875H12.8438V6.4875H11.1562V7.3875ZM12.8438 18.3H11.1562V19.2H12.8438V18.3ZM11.1562 18.3C9.96187 18.3 9.09996 18.2995 8.4291 18.2312C7.76577 18.1637 7.33932 18.0338 6.99996 17.807L6.49994 18.5554C7.01183 18.8974 7.60352 19.0519 8.33802 19.1266C9.06499 19.2005 9.9806 19.2 11.1562 19.2V18.3ZM4.8 12.8438C4.8 14.0194 4.79946 14.935 4.87341 15.662C4.94813 16.3965 5.10259 16.9882 5.44463 17.5001L6.19295 17C5.9662 16.6607 5.83627 16.2342 5.76879 15.5709C5.70054 14.9 5.7 14.0381 5.7 12.8438H4.8ZM6.99996 17.807C6.68058 17.5936 6.40636 17.3194 6.19295 17L5.44463 17.5001C5.7237 17.9177 6.08229 18.2763 6.49994 18.5554L6.99996 17.807ZM18.3 12.8438C18.3 14.0381 18.2995 14.9 18.2312 15.5709C18.1637 16.2342 18.0338 16.6607 17.807 17L18.5554 17.5001C18.8974 16.9882 19.0519 16.3965 19.1266 15.662C19.2005 14.935 19.2 14.0194 19.2 12.8438H18.3ZM12.8438 19.2C14.0194 19.2 14.935 19.2005 15.662 19.1266C16.3965 19.0519 16.9882 18.8974 17.5001 18.5554L17 17.807C16.6607 18.0338 16.2342 18.1637 15.5709 18.2312C14.9 18.2995 14.0381 18.3 12.8438 18.3V19.2ZM17.807 17C17.5936 17.3194 17.3194 17.5936 17 17.807L17.5001 18.5554C17.9177 18.2763 18.2763 17.9177 18.5554 17.5001L17.807 17ZM12.8438 7.3875C14.0381 7.3875 14.9 7.38804 15.5709 7.45629C16.2342 7.52377 16.6607 7.6537 17 7.88045L17.5001 7.13213C16.9882 6.79009 16.3965 6.63563 15.662 6.56091C14.935 6.48696 14.0194 6.4875 12.8438 6.4875V7.3875ZM19.2 12.8438C19.2 11.6681 19.2005 10.7525 19.1266 10.0255C19.0519 9.29102 18.8974 8.69933 18.5554 8.18744L17.807 8.68746C18.0338 9.02682 18.1637 9.45327 18.2312 10.1166C18.2995 10.7875 18.3 11.6494 18.3 12.8438H19.2ZM17 7.88045C17.3194 8.09386 17.5936 8.36808 17.807 8.68746L18.5554 8.18744C18.2763 7.76979 17.9177 7.4112 17.5001 7.13213L17 7.88045ZM11.1562 6.4875C9.9806 6.4875 9.06499 6.48696 8.33802 6.56091C7.60352 6.63563 7.01183 6.79009 6.49994 7.13213L6.99996 7.88045C7.33932 7.6537 7.76577 7.52377 8.4291 7.45629C9.09996 7.38804 9.96187 7.3875 11.1562 7.3875V6.4875ZM5.7 12.8438C5.7 11.6494 5.70054 10.7875 5.76879 10.1166C5.83627 9.45327 5.9662 9.02682 6.19295 8.68746L5.44463 8.18744C5.10259 8.69933 4.94813 9.29102 4.87341 10.0255C4.79946 10.7525 4.8 11.6681 4.8 12.8438H5.7ZM6.49994 7.13213C6.08229 7.4112 5.7237 7.76979 5.44463 8.18744L6.19295 8.68746C6.40636 8.36808 6.68058 8.09386 6.99996 7.88045L6.49994 7.13213ZM12.0798 6.19617L13.4912 6.51468L13.6893 5.63676L12.2779 5.31824L12.0798 6.19617ZM13.4912 6.51468C14.4913 6.74037 15.209 6.90285 15.7536 7.08397C16.2917 7.26293 16.6124 7.44535 16.8416 7.68298L17.4893 7.05817C17.1168 6.67196 16.641 6.43063 16.0376 6.22995C15.4406 6.03144 14.6715 5.85841 13.6893 5.63676L13.4912 6.51468ZM12.2779 5.31824C11.2956 5.09658 10.5268 4.92256 9.90118 4.84516C9.26838 4.76688 8.73387 4.78015 8.22772 4.96636L8.53844 5.81102C8.85456 5.69473 9.22676 5.66859 9.79069 5.73835C10.3618 5.809 11.0797 5.97049 12.0798 6.19617L12.2779 5.31824ZM8.22772 4.96636C7.81745 5.11728 7.44099 5.34567 7.12008 5.63906L7.72736 6.3033C7.96125 6.08947 8.23677 5.92199 8.53844 5.81102L8.22772 4.96636ZM6.99458 7.73187C7.21927 6.97765 7.42876 6.57629 7.72736 6.3033L7.12008 5.63906C6.6356 6.08199 6.36895 6.67967 6.13204 7.47492L6.99458 7.73187ZM16.8416 7.68298C16.9168 7.761 16.977 7.82463 17.0247 7.87627L17.6856 7.26541C17.6325 7.20793 17.5678 7.13951 17.4893 7.05817L16.8416 7.68298ZM5.25 12.0281H7.35938V11.1281H5.25V12.0281ZM7.35938 13.6594H5.25V14.5594H7.35938V13.6594ZM5.7 14.1094V11.5781H4.8V14.1094H5.7ZM8.175 12.8438C8.175 13.2942 7.80983 13.6594 7.35938 13.6594V14.5594C8.30689 14.5594 9.075 13.7913 9.075 12.8438H8.175ZM7.35938 12.0281C7.80983 12.0281 8.175 12.3933 8.175 12.8438H9.075C9.075 11.8962 8.30689 11.1281 7.35938 11.1281V12.0281ZM16.2188 15.7688H15.375V16.6688H16.2188V15.7688Z"
        fill="currentColor"
      />
    </svg>
  );
}
export default SvgWallet;