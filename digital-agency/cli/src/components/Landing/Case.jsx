import React from 'react';
import propertyImg from '../../data/projects/property.jpg';
import cryptoImg from '../../data/projects/crypto.jpg'
import netflixImg from '../../data/projects/netflix.jpg'
import twitchImg from '../../data/projects/twitch.jpg'
import CaseItem from './CaseItem';

const Case = () => {
  return (
    <div id='projects' className='w-full'>
      <div className='max-w-[1240px] mx-auto px-2 py-16'>
        <p className='text-xl tracking-widest uppercase text-[#5651e5]'>
          Проекты
        </p>
        <h2 className='py-4'>То, что мы сделали</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          <CaseItem
            title='Property Finder'
            backgroundImg={propertyImg}
            projectUrl='/property'
            tech='React JS'
          />
          <CaseItem
            title='Crypto App'
            backgroundImg={cryptoImg}
            projectUrl='/crypto'
            tech='React JS'

          />
          <CaseItem
            title='Netflix App'
            backgroundImg={netflixImg}
            projectUrl='/netflix'
            tech='React JS'

          />
          <CaseItem
            title='Twitch UI'
            backgroundImg={twitchImg}
            projectUrl='/twitch'
            tech='Next JS'

          />
        </div>
      </div>
    </div>
  );
};

export default Case;
