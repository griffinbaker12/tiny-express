WRAPPER_ASSIGNMENTS = ["__doc__", "__name__", "__qualname__", "__module__"]
WRAPPER_UPDATES = ["__dict__"]


def wraps(fn):
    def updated(*args):
        return update_wrapper(args[0], fn)

    return updated


def update_wrapper(
    wrapper, wrapped, assigned=WRAPPER_ASSIGNMENTS, updated=WRAPPER_UPDATES
):
    for attr in assigned:
        try:
            v = getattr(wrapped, attr)
        except AttributeError:
            pass
        else:
            setattr(wrapper, attr, v)
    for attr in updated:
        getattr(wrapper, attr).update(getattr(wrapped, attr, {}))
    wrapper.__wrapped__ = wrapped
    return wrapper


def logged(fn):
    @wraps(fn)
    def with_logging(*args, **kwargs):
        return fn(*args, **kwargs)

    return with_logging


def logged_no_wraps(fn):
    def with_logging(*args, **kwargs):
        return fn(*args, **kwargs)

    return with_logging


@logged_no_wraps
def say_hey():
    """this fn says hi"""
    print("hey")


@logged
def say_hey2():
    """this fn says hi"""
    print("hey")


print(say_hey.__name__)  # with_logging
print(say_hey2.__name__)  # say_hey2
