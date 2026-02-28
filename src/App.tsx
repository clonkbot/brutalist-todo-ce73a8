import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('brutalist-todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  useEffect(() => {
    localStorage.setItem('brutalist-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        ...todos,
        {
          id: crypto.randomUUID(),
          text: inputValue.trim().toUpperCase(),
          completed: false,
          createdAt: Date.now(),
        },
      ]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Warning stripe top */}
      <div className="h-3 md:h-4 bg-repeating-stripe" />

      <main className="flex-1 w-full max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-12">
        {/* Header */}
        <header className="border-4 border-black bg-white mb-6 md:mb-8">
          <div className="border-b-4 border-black px-3 md:px-6 py-3 md:py-4">
            <span className="font-mono text-xs md:text-sm text-neutral-500">
              SYSTEM://TASK_MANAGER/V1.0
            </span>
          </div>
          <div className="px-3 md:px-6 py-4 md:py-8">
            <h1 className="font-display text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-none">
              TO<span className="text-warning">—</span>DO
            </h1>
            <p className="font-mono text-xs md:text-sm mt-2 md:mt-4 text-neutral-600 uppercase tracking-widest">
              Raw productivity. No frills.
            </p>
          </div>
        </header>

        {/* Input Section */}
        <section className="border-4 border-black bg-white mb-6 md:mb-8">
          <div className="border-b-4 border-black px-3 md:px-6 py-2 md:py-3 bg-black text-white">
            <span className="font-mono text-xs uppercase tracking-widest">
              + Add New Task
            </span>
          </div>
          <div className="p-3 md:p-6">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                placeholder="ENTER TASK..."
                className="flex-1 border-4 border-black px-3 md:px-4 py-3 md:py-4 font-mono text-sm md:text-lg uppercase placeholder:text-neutral-400 focus:outline-none focus:border-warning transition-colors"
              />
              <button
                onClick={addTodo}
                className="border-4 border-black bg-warning px-6 md:px-8 py-3 md:py-4 font-mono font-bold text-sm md:text-lg uppercase hover:bg-black hover:text-warning transition-colors active:translate-y-0.5 min-h-[52px]"
              >
                ADD
              </button>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-4 border-black bg-white mb-6 md:mb-8 grid grid-cols-3 divide-x-4 divide-black">
          <div className="p-3 md:p-4 text-center">
            <div className="font-display text-2xl md:text-4xl font-black">{todos.length}</div>
            <div className="font-mono text-xs uppercase text-neutral-500">Total</div>
          </div>
          <div className="p-3 md:p-4 text-center">
            <div className="font-display text-2xl md:text-4xl font-black text-warning">
              {activeCount}
            </div>
            <div className="font-mono text-xs uppercase text-neutral-500">Active</div>
          </div>
          <div className="p-3 md:p-4 text-center">
            <div className="font-display text-2xl md:text-4xl font-black text-neutral-400">
              {completedCount}
            </div>
            <div className="font-mono text-xs uppercase text-neutral-500">Done</div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="flex border-4 border-black border-b-0">
          {(['all', 'active', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-3 md:px-6 py-3 md:py-4 font-mono text-xs md:text-sm uppercase tracking-widest transition-colors ${
                filter === f
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Todo List */}
        <section className="border-4 border-black bg-white">
          {filteredTodos.length === 0 ? (
            <div className="p-8 md:p-16 text-center">
              <div className="font-mono text-neutral-400 uppercase text-xs md:text-sm">
                {filter === 'all'
                  ? '[ NO TASKS REGISTERED ]'
                  : filter === 'active'
                  ? '[ NO ACTIVE TASKS ]'
                  : '[ NO COMPLETED TASKS ]'}
              </div>
            </div>
          ) : (
            <ul>
              {filteredTodos.map((todo, index) => (
                <li
                  key={todo.id}
                  className={`border-b-4 border-black last:border-b-0 ${
                    todo.completed ? 'bg-neutral-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-stretch">
                    {/* Index number */}
                    <div className="border-r-4 border-black px-3 md:px-4 py-3 md:py-4 font-mono text-xs text-neutral-400 w-12 md:w-16 flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Checkbox */}
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`border-r-4 border-black w-12 md:w-16 flex items-center justify-center shrink-0 transition-colors min-h-[52px] ${
                        todo.completed
                          ? 'bg-black text-warning'
                          : 'bg-white hover:bg-warning'
                      }`}
                    >
                      <span className="font-mono text-lg md:text-2xl font-bold">
                        {todo.completed ? '■' : '□'}
                      </span>
                    </button>

                    {/* Task text */}
                    <div className="flex-1 px-3 md:px-4 py-3 md:py-4 flex items-center min-w-0">
                      <span
                        className={`font-mono text-sm md:text-base break-words ${
                          todo.completed
                            ? 'line-through text-neutral-400'
                            : 'text-black'
                        }`}
                      >
                        {todo.text}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="border-l-4 border-black w-12 md:w-16 flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white transition-colors min-h-[52px]"
                    >
                      <span className="font-mono text-lg md:text-2xl font-bold">×</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Clear completed */}
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="mt-6 md:mt-8 w-full border-4 border-black border-dashed px-4 py-3 md:py-4 font-mono text-xs md:text-sm uppercase tracking-widest text-neutral-500 hover:border-solid hover:bg-black hover:text-white transition-all"
          >
            Clear {completedCount} completed task{completedCount > 1 ? 's' : ''}
          </button>
        )}
      </main>

      {/* Blueprint grid decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-grid" />

      {/* Warning stripe bottom */}
      <div className="h-3 md:h-4 bg-repeating-stripe" />

      {/* Footer */}
      <footer className="py-4 text-center">
        <span className="font-mono text-xs text-neutral-400">
          Requested by @web-user · Built by @clonkbot
        </span>
      </footer>
    </div>
  );
}

export default App;
