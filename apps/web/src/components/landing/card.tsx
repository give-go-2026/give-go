import Image from 'next/image';
import { EventCard } from '@/lib/definitions';
import { Apply, Details } from './card-buttons';
import { formatDuration } from '@/lib/utils';

export default function Card({ card }: { card: EventCard }) {
  return (
    <div className='h-max max-h-133.75 w-73.5 snap-center rounded-3xl shadow-xl md:w-100'>
      <div className='flex h-full flex-col gap-2 overflow-clip rounded-3xl'>
        <Image
          src={card.image_url}
          alt='Card placeholder'
          width={400}
          height={175}
          className='h-35 object-cover'
        />
        <div className='flex flex-1 flex-col justify-center gap-1 p-4'>
          <div className='max-h-fit w-full snap-x snap-mandatory overflow-auto'>
            <div className='grid h-full min-w-fit grid-flow-col place-content-start gap-2 pb-1'>
              {card.tags.map((tag) => (
                <span
                  key={tag.name}
                  className='inline-block rounded-full px-5 py-1 text-xs font-medium text-pretty text-white md:text-sm'
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          <h4 className='text-xl tracking-wide text-pretty'>{card.title}</h4>
          <span className='font-bold text-gray-500'>{card.address}</span>
          <span className='text-lg font-bold text-black'>
            {formatDuration(new Date(card.start_date), new Date(card.end_date))}
          </span>
          <span className='text-sm text-gray-600'>{card.organizer.name}</span>
          <span className='line-clamp-3 text-sm wrap-break-word text-gray-500'>
            {card.description}
          </span>
          <div className='mt-2 flex justify-between gap-2'>
            <Apply id={card.id} />
            <Details id={card.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
