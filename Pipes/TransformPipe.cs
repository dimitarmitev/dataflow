using DataflowApp.Hubs;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Pipes
{
    public class TransformPipe : BasePipe
    {
        public TransformPipe(IServiceProvider sp) : base(sp)
        {
            var transformBlock =
                new TransformBlock<Shape, Shape>(
                    (shape) =>
                    {
                        shape.Type = "rectangle";
                        return shape;
                    }
                );
            var actionBlock =
                new ActionBlock<Shape>(
                    async (shape) =>
                    {
                        await Task.Delay(1000);
                        await SendShape(shape);
                    }
                );
            transformBlock.LinkTo(actionBlock);
            EntryPoint = transformBlock;
        }
    }
}
