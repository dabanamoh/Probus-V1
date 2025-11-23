import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { Label } from "../../shared/ui/label";
import { Textarea } from "../../shared/ui/textarea";
import { Calendar, Plus, List, CheckSquare, Square, User, Paperclip } from 'lucide-react';

const TrelloIntegration = () => {
  const [activeBoard, setActiveBoard] = useState('board-1');
  const [showAddCard, setShowAddCard] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({ title: '', description: '' });

  // Mock data for boards
  const boards = [
    {
      id: 'board-1',
      name: 'Product Development',
      lists: [
        {
          id: 'list-1',
          name: 'To Do',
          cards: [
            { id: 'card-1', title: 'Research competitors', description: 'Analyze competitor products and features', labels: ['Research'] },
            { id: 'card-2', title: 'Create wireframes', description: 'Design initial wireframes for new features', labels: ['Design'] }
          ]
        },
        {
          id: 'list-2',
          name: 'In Progress',
          cards: [
            { id: 'card-3', title: 'Implement auth system', description: 'Build authentication and authorization system', labels: ['Backend'] },
            { id: 'card-4', title: 'Design dashboard', description: 'Create UI design for admin dashboard', labels: ['Design'] }
          ]
        },
        {
          id: 'list-3',
          name: 'Review',
          cards: [
            { id: 'card-5', title: 'Code review', description: 'Review pull requests from team members', labels: ['Code'] }
          ]
        },
        {
          id: 'list-4',
          name: 'Done',
          cards: [
            { id: 'card-6', title: 'Setup project', description: 'Initialize project structure and dependencies', labels: ['Setup'] }
          ]
        }
      ]
    },
    {
      id: 'board-2',
      name: 'Marketing Campaign',
      lists: [
        {
          id: 'list-5',
          name: 'Planning',
          cards: [
            { id: 'card-7', title: 'Define target audience', description: 'Identify and segment target customers', labels: ['Research'] }
          ]
        },
        {
          id: 'list-6',
          name: 'Execution',
          cards: []
        }
      ]
    }
  ];

  const currentBoard = boards.find(board => board.id === activeBoard) || boards[0];

  const handleAddCard = (listId: string) => {
    // In a real implementation, this would add a card to the list
    console.log(`Adding card to list ${listId}:`, newCard);
    setNewCard({ title: '', description: '' });
    setShowAddCard(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Trello Integration</h1>
            <p className="text-gray-600">Manage your projects and tasks directly from Probus</p>
          </div>
        </div>

        {/* Board Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {boards.map((board) => (
            <Button
              key={board.id}
              variant={activeBoard === board.id ? "default" : "outline"}
              onClick={() => setActiveBoard(board.id)}
            >
              {board.name}
            </Button>
          ))}
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            New Board
          </Button>
        </div>

        {/* Board Content */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {currentBoard.lists.map((list) => (
              <Card key={list.id} className="w-72 flex-shrink-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    {list.name}
                    <span className="text-sm font-normal text-gray-500">
                      {list.cards.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {list.cards.map((card) => (
                      <div 
                        key={card.id} 
                        className="p-3 bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {card.labels.map((label, index) => (
                            <span 
                              key={index} 
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                          </div>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <Paperclip className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {showAddCard === list.id ? (
                      <div className="p-3 bg-white border rounded-lg shadow-sm">
                        <Input
                          name="title"
                          value={newCard.title}
                          onChange={handleInputChange}
                          placeholder="Card title"
                          className="mb-2"
                        />
                        <Textarea
                          name="description"
                          value={newCard.description}
                          onChange={handleInputChange}
                          placeholder="Description"
                          rows={2}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleAddCard(list.id)}
                          >
                            Add Card
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowAddCard(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-500 hover:text-gray-700"
                        onClick={() => setShowAddCard(list.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add a card
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add List */}
            <Card className="w-72 flex-shrink-0">
              <CardContent className="p-4">
                <Button variant="outline" className="w-full h-16 justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  Add another list
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrelloIntegration;
