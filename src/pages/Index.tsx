
import MinesweeperGame from "@/components/MinesweeperGame";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Minesweeper</h1>
      <MinesweeperGame />
    </div>
  );
};

export default Index;
