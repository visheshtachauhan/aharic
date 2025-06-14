'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card } from '@/components/ui/card';
import { Star, GripVertical } from 'lucide-react';
import { MenuItem } from '@/types/order';

interface DraggableMenuProps {
  items: MenuItem[];
  onReorder: (items: MenuItem[]) => void;
}

export function DraggableMenu({ items, onReorder }: DraggableMenuProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (result: any) => {
    setIsDragging(false);

    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    onReorder(newItems);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="menu-items">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-white rounded-xl transition-all duration-300 ${
                      snapshot.isDragging ? 'shadow-lg scale-[1.02]' : 'shadow-sm'
                    }`}
                  >
                    <Card className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          {...provided.dragHandleProps}
                          className="p-2 hover:bg-[#FFF6F0] rounded-lg cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="w-5 h-5 text-[#666666]" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-[#2D2D2D]">{item.name}</h3>
                              <p className="text-sm text-[#666666]">{item.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-[#FFB800] fill-current" />
                              <p className="font-medium text-[#FF7300]">₹{item.price}</p>
                            </div>
                          </div>
                          
                          {item.description && (
                            <p className="mt-2 text-sm text-[#666666]">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 