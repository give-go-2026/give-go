'use client';

import { searchProfiles } from '@/lib/constants';
import { ArrowDownIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from '@repo/ui/button';
import Image from 'next/image';
import { PropsWithChildren, useState } from 'react';

export default function SearchMain() {
  const [selectedProfile, setSelectedProfile] = useState(searchProfiles[0]?.id ?? 1);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([
    'Petrik Alapítvány',
  ]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['Gyerekek', 'Tanárok']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Budapest']);
  const [locationTypes, setLocationTypes] = useState({
    in_person: {
      selected: false,
      label: 'Személyesen',
    },
    online: {
      selected: false,
      label: 'Online',
    },
    hybrid: {
      selected: true,
      label: 'Hibrid',
    },
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Fizikai munka', 'Irodai munka']);
  const [choosesExactDate, setChoosesExactDate] = useState(false);
  const [selectedDayType, setSelectedDayType] = useState({
    weekday: {
      selected: true,
      label: 'Hétköznap',
    },
    weekend: {
      selected: false,
      label: 'Hétvége',
    },
  });
  const [chosenDates, setChosenDates] = useState({
    start: '',
    end: '',
  });
  const [choosesExactTime, setChoosesExactTime] = useState(false);
  const [selectedTimeType, setSelectedTimeType] = useState({
    morning: {
      selected: true,
      label: 'Reggel',
    },
    before_noon: {
      selected: true,
      label: 'Délelőtt',
    },
    afternoon: {
      selected: true,
      label: 'Délután',
    },
    evening: {
      selected: false,
      label: 'Este',
    },
  });
  const [chosenTime, setChosenTime] = useState({
    start: '',
    end: '',
  });

  function handleLocationSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const location = formData.get('location')?.toString().trim();
    if (location && !selectedLocations.includes(location)) {
      setSelectedLocations((prev) => [...prev, location]);
    }
    event.currentTarget.reset();
  }

  function handleOrganizationSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const organization = formData.get('organization')?.toString().trim();
    if (organization && !selectedOrganizations.includes(organization)) {
      setSelectedOrganizations((prev) => [...prev, organization]);
    }
    event.currentTarget.reset();
  }

  function handleGroupSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const group = formData.get('group')?.toString().trim();
    if (group && !selectedGroups.includes(group)) {
      setSelectedGroups((prev) => [...prev, group]);
    }
    event.currentTarget.reset();
  }

  function handleTypeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = formData.get('type')?.toString().trim();
    if (type && !selectedTypes.includes(type)) {
      setSelectedTypes((prev) => [...prev, type]);
    }
    event.currentTarget.reset();
  }

  return (
    <main className='container flex grow flex-col gap-6 rounded-3xl bg-gray-100 py-6 shadow-xl'>
      <section className='flex w-full flex-col gap-12 px-6 2xl:flex-row'>
        <div className='flex flex-col justify-center gap-2'>
          <h2 className='text-2xl font-semibold md:text-3xl'>Válaszd ki a rád passzolót!</h2>
          <span className='md:text-lg'>
            Válasz az előre beálíltott profilokból vagy állísd be egyedileg a keresőt.
          </span>
        </div>
        <div className='grid grid-cols-1 place-items-center gap-3 px-3 md:grid-cols-2 lg:p-0 xl:grid-cols-4'>
          {searchProfiles.map((profile) => (
            <ProfileCard
              key={profile.name}
              title={profile.title}
              selected={profile.id === selectedProfile}
              onClickAction={() => setSelectedProfile(profile.id)}
            />
          ))}
        </div>
      </section>
      <SectionWrapper>
        <SectionTitle title='Melyik szervezetnek szeretnél segíteni?' />
        <SectionDescription description='Add meg a szervezet konkrét nevét vagy állíts be tevékenységi köröket amik közül akánljunk szervezetett.' />
        <form onSubmit={handleOrganizationSubmit}>
          <SectionInput
            placeholder='pl: Máltai szeretet szolgálat'
            name='organization'
            className='w-full md:w-1/2'
          />
        </form>
        <div className='flex flex-wrap gap-3'>
          {selectedOrganizations.map((organization, idx) => (
            <SelectedItemCard
              key={idx}
              title={organization}
              onClickAction={() =>
                setSelectedOrganizations((prev) => prev.filter((org) => org !== organization))
              }
            />
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Kiknek szeretnél segíteni?' />
        <SectionDescription description='Add meg a célcsoportot akinek segíteni szeretnél.' />
        <form onSubmit={handleGroupSubmit}>
          <SectionInput
            placeholder='pl: Állatok'
            name='group'
            className='w-full md:w-1/2'
          />
        </form>
        <div className='flex flex-wrap gap-3'>
          {selectedGroups.map((group, idx) => (
            <SelectedItemCard
              key={idx}
              title={group}
              onClickAction={() => setSelectedGroups((prev) => prev.filter((grp) => grp !== group))}
            />
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Hol szeretnél önkénteskedni?' />
        <SectionDescription description='Add meg a régiót vagy a települést' />
        <form onSubmit={handleLocationSubmit}>
          <SectionInput
            placeholder='Pl: Kalocsa'
            name='location'
            className='w-full md:w-1/2'
          />
        </form>
        <span>Válasz egy városrészt amin belül mutatjuk a lehetőségeket.</span>
        <div className='flex flex-wrap gap-3'>
          {selectedLocations.map((location, idx) => (
            <SelectedItemCard
              key={idx}
              title={location}
              onClickAction={() =>
                setSelectedLocations((prev) => prev.filter((loc) => loc !== location))
              }
            />
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Hogyan szeretnél segíteni?' />
        <SectionDescription description='Többet is beállíthatsz.' />
        <div className='grid grid-cols-1 justify-around gap-6 md:grid-cols-3 md:gap-14 lg:gap-18'>
          {Object.entries(locationTypes).map(([key, { label, selected }]) => (
            <Button
              key={key}
              styleVariant={selected ? 'filled' : 'outlined'}
              styleType='primary'
              onClick={() =>
                setLocationTypes((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key as keyof typeof prev],
                    selected: !prev[key as keyof typeof prev].selected,
                  },
                }))
              }
              fill
              big
            >
              {label}
            </Button>
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Milyen típusú önkénteskedést keresel?' />
        <SectionDescription description='Add meg a típusokat.' />
        <form onSubmit={handleTypeSubmit}>
          <SectionInput
            placeholder='Pl: Fizikai/irodai munka'
            name='type'
            className='w-full md:w-1/2'
          />
        </form>
        <div className='flex flex-wrap gap-3'>
          {selectedTypes.map((type, idx) => (
            <SelectedItemCard
              key={idx}
              title={type}
              onClickAction={() => setSelectedTypes((prev) => prev.filter((t) => t !== type))}
            />
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Mikor érsz rá?' />
        {choosesExactDate ? (
          <>
            <SectionDescription description='Időpont választó' />
            <div className='flex flex-col justify-between gap-4 md:flex-row'>
              <input
                type='date'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 text-lg'
                value={chosenDates.start}
                onChange={(e) => setChosenDates((prev) => ({ ...prev, start: e.target.value }))}
              />
              <ArrowDownIcon className='size-6 self-center md:hidden' />
              <ArrowRightIcon className='hidden size-12 self-center md:block' />
              <input
                type='date'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 text-lg'
                value={chosenDates.end}
                onChange={(e) => setChosenDates((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </>
        ) : (
          <div className='grid grid-cols-2 justify-around gap-6 md:gap-12'>
            {Object.entries(selectedDayType).map(([key, { label, selected }]) => (
              <Button
                key={key}
                styleVariant={selected ? 'filled' : 'outlined'}
                styleType='primary'
                onClick={() =>
                  setSelectedDayType((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key as keyof typeof prev],
                      selected: !prev[key as keyof typeof prev].selected,
                    },
                  }))
                }
                fill
                big
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        <span
          className='text-foreground/90 my-3 cursor-pointer underline underline-offset-2 transition-all ease-in-out select-none hover:tracking-widest'
          onClick={() => setChoosesExactDate((prev) => !prev)}
        >
          {choosesExactDate ? 'Mutasd az időszakokat' : 'Konkrét dátumot szeretnék megadni'}
        </span>
        {choosesExactTime ? (
          <>
            <SectionDescription description='Időszak választó' />
            <div className='flex flex-col justify-between gap-4 md:flex-row'>
              <input
                type='time'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 text-lg'
                value={chosenTime.start}
                onChange={(e) => setChosenTime((prev) => ({ ...prev, start: e.target.value }))}
              />
              <ArrowDownIcon className='size-6 self-center md:hidden' />
              <ArrowRightIcon className='hidden size-12 self-center md:block' />
              <input
                type='time'
                className='w-full rounded-lg border border-gray-300 px-4 py-2 text-lg'
                value={chosenTime.end}
                onChange={(e) => setChosenTime((prev) => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </>
        ) : (
          <div className='grid grid-cols-2 justify-around gap-6 md:grid-cols-4 md:gap-12'>
            {Object.entries(selectedTimeType).map(([key, { label, selected }]) => (
              <Button
                key={key}
                styleVariant={selected ? 'filled' : 'outlined'}
                styleType='primary'
                onClick={() =>
                  setSelectedTimeType((prev) => ({
                    ...prev,
                    [key]: {
                      ...prev[key as keyof typeof prev],
                      selected: !prev[key as keyof typeof prev].selected,
                    },
                  }))
                }
                fill
                big
              >
                {label}
              </Button>
            ))}
          </div>
        )}
        <span
          className='text-foreground/90 mt-3 cursor-pointer underline underline-offset-2 transition-all ease-in-out select-none hover:tracking-widest'
          onClick={() => setChoosesExactTime((prev) => !prev)}
        >
          {choosesExactTime ? 'Mutasd a napszakokat' : 'Konkrét időpontot szeretnék megadni'}
        </span>
      </SectionWrapper>
      <Button
        styleType='primary'
        styleVariant='outlined'
        fill
        big
      >
        Keresés
      </Button>
    </main>
  );
}

function SectionWrapper({ children }: PropsWithChildren) {
  return (
    <section className='flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-2xl'>
      {children}
    </section>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className='text-xl font-semibold md:text-2xl'>{title}</h3>;
}

function SectionDescription({ description }: { description: string }) {
  return <span className='text-base md:text-lg'>{description}</span>;
}

function SectionInput({
  placeholder,
  name,
  className,
}: {
  placeholder: string;
  name: string;
  className?: string;
}) {
  return (
    <input
      type='text'
      className={`focus:outline-foreground focus:border-foreground mt-3 rounded-lg border border-gray-300 px-4 py-2 text-lg ${className}`}
      placeholder={placeholder}
      name={name}
    />
  );
}

function ProfileCard({
  title,
  selected,
  onClickAction,
}: {
  title: string;
  selected: boolean;
  onClickAction: () => void;
}) {
  return (
    <button
      className={`flex aspect-video max-h-32 w-full flex-col items-center justify-center gap-3 rounded-xl border border-gray-300 p-3 shadow-lg transition-transform hover:scale-102 ${selected ? 'main-gradient' : 'bg-white'}`}
      onClick={onClickAction}
    >
      <Image
        src='/standing-person.png'
        alt='standing person icon'
        width={32}
        height={32}
      />
      <span className='text-wrap'>{title}</span>
    </button>
  );
}

function SelectedItemCard({ title, onClickAction }: { title: string; onClickAction: () => void }) {
  return (
    <button
      onClick={onClickAction}
      className='bg-foreground flex max-h-10 w-fit items-center gap-3 rounded-full px-6 py-3 text-white'
    >
      <span className='grow text-nowrap'>{title}</span>
      <span className='w-1/5'>X</span>
    </button>
  );
}
