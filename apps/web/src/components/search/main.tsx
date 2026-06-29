'use client';

import { searchProfiles } from '@/lib/constants';
import { searchEventsAction } from '@/features/events/lib/actions';
import type { EventSearchFilters, SearchFilterOptions } from '@/features/events/lib/queries';
import type { EventCard } from '@/lib/definitions';
import { TagAutocomplete } from '@/components/ui/tag-autocomplete';
import Card from '@/components/landing/card';
import { ArrowDownIcon, ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from '@repo/ui/button';
import Image from 'next/image';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

/** Preset filter sets applied when a profile button is clicked. Keyed by Profile.name. */
const PROFILE_FILTERS: Record<string, EventSearchFilters> = {
  helping: {},
  professional: {
    workTypes: [
      'irodai',
      'IT programozás, Fejlesztés',
      'Marketing, Média, PR',
      'Projekt Menedzsment',
      'Mérnök',
      'Pénzügy, Könyvelés',
    ],
  },
  community: { recurring: true },
  mandatory: {
    workTypes: [
      'fizikai',
      'szociális',
      'Fizikai, Segéd, Betanított munka',
      'Oktatás, Tudomány, Sport',
    ],
    helpModes: ['Személyes'],
  },
};

const HELP_MODES = ['Személyes', 'Online', 'Hibrid'] as const;

export default function SearchMain({ options }: { options: SearchFilterOptions }) {
  const [selectedProfile, setSelectedProfile] = useState(searchProfiles[0]?.id ?? 1);
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedHelpModes, setSelectedHelpModes] = useState<string[]>([]);

  const [results, setResults] = useState<EventCard[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

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

  function currentFilters(): EventSearchFilters {
    return {
      organizations: selectedOrganizations,
      groups: selectedGroups,
      locations: selectedLocations,
      workTypes: selectedWorkTypes,
      helpModes: selectedHelpModes,
    };
  }

  async function performSearch(filters: EventSearchFilters) {
    setLoading(true);
    try {
      const found = await searchEventsAction(filters);
      setResults(found);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function applyProfile(profileId: number, profileName: string) {
    const preset = PROFILE_FILTERS[profileName] ?? {};
    setSelectedProfile(profileId);
    setSelectedOrganizations(preset.organizations ?? []);
    setSelectedGroups(preset.groups ?? []);
    setSelectedLocations(preset.locations ?? []);
    setSelectedWorkTypes(preset.workTypes ?? []);
    setSelectedHelpModes(preset.helpModes ?? []);
    void performSearch(preset);
  }

  function toggleHelpMode(mode: string) {
    setSelectedHelpModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode],
    );
  }

  return (
    <main className='container flex grow flex-col gap-6 rounded-3xl bg-gray-100 px-5 py-6 shadow-xl'>
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
              onClickAction={() => applyProfile(profile.id, profile.name)}
            />
          ))}
        </div>
      </section>
      <SectionWrapper>
        <SectionTitle title='Melyik szervezetnek szeretnél segíteni?' />
        <SectionDescription description='Itt megadhatod a konkrét szervezetet, ahol segíteni szeretnél.' />
        <div className='w-full md:w-1/2'>
          <TagAutocomplete
            value={selectedOrganizations}
            onChange={setSelectedOrganizations}
            suggestions={options.organizations}
            placeholder='pl: Máltai szeretet szolgálat'
          />
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Kiknek szeretnél segíteni?' />
        <SectionDescription description='Add meg a célcsoportot akinek segíteni szeretnél.' />
        <div className='w-full md:w-1/2'>
          <TagAutocomplete
            value={selectedGroups}
            onChange={setSelectedGroups}
            suggestions={options.groups}
            placeholder='pl: Állatok'
          />
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Hol szeretnél önkénteskedni?' />
        <SectionDescription description='Válassz a regisztrált helyszínek közül.' />
        <MultiSelectDropdown
          options={options.locations}
          selected={selectedLocations}
          onChange={setSelectedLocations}
          placeholder='Válassz helyszínt'
          className='w-full md:w-1/2'
        />
        <div className='flex flex-wrap gap-3'>
          {selectedLocations.map((location) => (
            <SelectedItemCard
              key={location}
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
          {HELP_MODES.map((mode) => (
            <Button
              key={mode}
              styleVariant={selectedHelpModes.includes(mode) ? 'filled' : 'outlined'}
              styleType='primary'
              onClick={() => toggleHelpMode(mode)}
              fill
              big
            >
              {mode}
            </Button>
          ))}
        </div>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitle title='Milyen típusú önkénteskedést keresel?' />
        <SectionDescription description='Több típust is kiválaszthatsz.' />
        <MultiSelectDropdown
          options={options.workTypes}
          selected={selectedWorkTypes}
          onChange={setSelectedWorkTypes}
          placeholder='Válassz munka típust'
          className='w-full md:w-1/2'
        />
        <div className='flex flex-wrap gap-3'>
          {selectedWorkTypes.map((type) => (
            <SelectedItemCard
              key={type}
              title={type}
              onClickAction={() => setSelectedWorkTypes((prev) => prev.filter((t) => t !== type))}
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
        onClick={() => void performSearch(currentFilters())}
        fill
        big
      >
        {loading ? 'Keresés…' : 'Keresés'}
      </Button>
      {hasSearched && (
        <SearchResults
          results={results}
          loading={loading}
        />
      )}
    </main>
  );
}

function SearchResults({ results, loading }: { results: EventCard[]; loading: boolean }) {
  if (loading && results.length === 0) {
    return <p className='px-2 text-lg text-gray-500'>Keresés folyamatban…</p>;
  }
  if (results.length === 0) {
    return (
      <p className='px-2 text-lg text-gray-500'>
        Nincs a szűrőknek megfelelő találat. Próbálj tágítani a szűrőkön.
      </p>
    );
  }
  return (
    <section className='flex flex-col items-center gap-4'>
      <h3 className='px-2 text-xl font-semibold md:text-2xl'>{results.length} találat</h3>
      <div className='grid min-h-fit min-w-fit grid-cols-1 place-content-between gap-10 px-5 pt-5 pb-10 lg:grid-cols-2 2xl:grid-cols-3'>
        {results.map((card) => (
          <Card
            key={card.id}
            card={card}
          />
        ))}
      </div>
    </section>
  );
}

function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function toggle(option: string) {
    onChange(
      selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option],
    );
  }

  return (
    <div
      className={`relative ${className ?? ''}`}
      ref={containerRef}
    >
      <button
        type='button'
        onClick={() => setIsOpen((v) => !v)}
        className='focus:outline-foreground focus:border-foreground flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-2 text-left text-lg'
      >
        <span className={selected.length > 0 ? 'text-gray-900' : 'text-gray-400'}>
          {selected.length > 0 ? `${selected.length} kiválasztva` : placeholder}
        </span>
        <ChevronDownIcon className='size-5 shrink-0 text-gray-400' />
      </button>
      {isOpen && (
        <ul className='absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-gray-200 bg-white py-1 shadow-xl'>
          {options.length === 0 && (
            <li className='px-3 py-2 text-sm text-gray-400'>Nincs elérhető opció</li>
          )}
          {options.map((option) => (
            <li key={option}>
              <button
                type='button'
                onClick={() => toggle(option)}
                className='flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-cyan-50'
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                    selected.includes(option)
                      ? 'border-cyan-900 bg-cyan-900 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {selected.includes(option) && '✓'}
                </span>
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
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
